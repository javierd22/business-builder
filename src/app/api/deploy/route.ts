import { NextResponse } from "next/server";

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function logError(requestId: string, error: unknown, context: string) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${requestId}] ${context}:`, error instanceof Error ? error.message : error);
}

function generateMockDeploymentUrl(projectId: string): string {
  const randomId = Math.random().toString(36).substring(2, 8);
  return `https://business-builder-${projectId}-${randomId}.vercel.app`;
}

export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    expects: "POST { projectId: string }",
    returns: "{ url?: string, status: 'deploying' | 'completed' | 'failed' }"
  }, {
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(req: Request) {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] [${requestId}] Deployment request started`);
  
  try {
    const body = await req.json();
    const { projectId } = body;
    
    if (!projectId || typeof projectId !== "string") {
      logError(requestId, "Missing or invalid projectId parameter", "Validation");
      return NextResponse.json(
        { message: "Project ID is required for deployment" }, 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const hookUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL;

    if (!hookUrl) {
      console.log(`[${timestamp}] [${requestId}] No deploy hook configured, returning mock deployment`);
      
      const mockUrl = generateMockDeploymentUrl(projectId);
      
      return NextResponse.json(
        { 
          url: mockUrl,
          status: "completed" as const
        },
        { headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const deployResponse = await fetch(hookUrl, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ projectId })
      });

      if (!deployResponse.ok) {
        const errorText = await deployResponse.text().catch(() => "Unknown error");
        logError(requestId, `Deploy hook failed: ${deployResponse.status} ${deployResponse.statusText} - ${errorText}`, "Deploy Hook");
        
        return NextResponse.json(
          { 
            status: "failed" as const,
            message: "Deployment failed. Please try again in a few minutes."
          },
          { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      let deployData;
      try {
        deployData = await deployResponse.json();
      } catch {
        deployData = null;
      }

      const deploymentUrl = deployData?.url || deployData?.deployment?.url;
      
      console.log(`[${timestamp}] [${requestId}] Deployment triggered successfully`);
      
      return NextResponse.json(
        { 
          url: deploymentUrl,
          status: deploymentUrl ? "completed" as const : "deploying" as const
        },
        { headers: { "Content-Type": "application/json" } }
      );

    } catch (networkError) {
      logError(requestId, networkError, "Network Error");
      
      return NextResponse.json(
        { 
          status: "failed" as const,
          message: "Network error during deployment. Please check your connection and try again."
        },
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
  } catch (error) {
    logError(requestId, error, "Server Error");
    return NextResponse.json(
      { 
        status: "failed" as const,
        message: "Unable to process deployment request. Please try again." 
      }, 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}