# Business Builder

Transform your business ideas into structured plans and professional presentations in minutes.

This is a [Next.js](https://nextjs.org) project that provides a complete business planning workflow: Idea → PRD → UX → Deploy.

## Features

- **AI-Powered Business Planning**: Generate comprehensive Product Requirements Documents from simple ideas
- **UX Design Generation**: Create detailed user experience specifications
- **Mock Deployment**: Simulate app deployment for complete workflow testing
- **Robust Error Handling**: Friendly error messages with retry functionality
- **Responsive Design**: Beautiful beige/gold theme optimized for all devices
- **localStorage Persistence**: Projects saved locally for demo purposes

## Getting Started

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Mock Mode (Demo)

For demonstrations or development without AI services, enable mock mode:

```bash
# Local development
NEXT_PUBLIC_MOCK_AI=true npm run dev

# Or set as environment variable
export NEXT_PUBLIC_MOCK_AI=true
```

When mock mode is enabled:
- PRD generation returns sample business plan content
- UX generation returns sample user experience design
- Deployment returns demo URL (https://example.com/live-demo)
- UI shows "Using sample content" indicators

### Vercel Deployment

Set the environment variable in your Vercel dashboard or Preview environments:

```
NEXT_PUBLIC_MOCK_AI=true
```

This enables full workflow demonstration without requiring AI API keys.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# business-builder
# business-builder
# business-builder
