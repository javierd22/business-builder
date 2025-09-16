"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects } from "@/lib/storage";
import { getGlobalInsights, getRecentProjectInsights, formatDuration } from "@/lib/insights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { EmptyStates } from "@/app/_components/EmptyState";
import { Project } from "@/lib/storage";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<ReturnType<typeof getGlobalInsights> | null>(null);
  const [recentInsights, setRecentInsights] = useState<ReturnType<typeof getRecentProjectInsights>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const projectData = getProjects();
      setProjects(projectData);

      const globalInsights = getGlobalInsights();
      setInsights(globalInsights);

      const recentProjectInsights = getRecentProjectInsights();
      setRecentInsights(recentProjectInsights);

      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F7DC6F] border-t-transparent mx-auto mb-4" />
            <p className="text-[#6B7280]">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#4A5568] mb-4">Your Dashboard</h1>
            <p className="text-lg text-[#6B7280]">Track your business building progress and insights.</p>
          </div>
          <Card>
            <CardContent>
              {EmptyStates.noProjects}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#4A5568] mb-4">Your Dashboard</h1>
          <p className="text-lg text-[#6B7280]">Track your business building progress and insights.</p>
        </div>

        {/* Insights Overview */}
        {insights && insights.totalProjects > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5568] mb-2">
                    {insights.totalProjects}
                  </div>
                  <div className="text-sm text-[#6B7280]">Total Projects</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5568] mb-2">
                    {insights.completedProjects}
                  </div>
                  <div className="text-sm text-[#6B7280]">Completed</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5568] mb-2">
                    {Math.round(insights.completionRate)}%
                  </div>
                  <div className="text-sm text-[#6B7280]">Completion Rate</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5568] mb-2">
                    {formatDuration(insights.medianTimeToPRD)}
                  </div>
                  <div className="text-sm text-[#6B7280]">Avg Time to PRD</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Insights */}
        {insights && insights.totalProjects > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-[#4A5568]">Performance Insights</CardTitle>
              <CardDescription>
                Your business building efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
                  <div className="text-2xl font-bold text-[#8B7355] mb-2">
                    {formatDuration(insights.averageTimeToPRD)}
                  </div>
                  <div className="text-sm text-[#8B7355]">Average Time to PRD</div>
                  <div className="text-xs text-[#8B7355] mt-1">
                    Median: {formatDuration(insights.medianTimeToPRD)}
                  </div>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
                  <div className="text-2xl font-bold text-[#8B7355] mb-2">
                    {formatDuration(insights.averageTimeToUX)}
                  </div>
                  <div className="text-sm text-[#8B7355]">Average Time to UX</div>
                  <div className="text-xs text-[#8B7355] mt-1">
                    Median: {formatDuration(insights.medianTimeToUX)}
                  </div>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
                  <div className="text-2xl font-bold text-[#8B7355] mb-2">
                    {formatDuration(insights.averageTimeToDeploy)}
                  </div>
                  <div className="text-sm text-[#8B7355]">Average Time to Deploy</div>
                  <div className="text-xs text-[#8B7355] mt-1">
                    Median: {formatDuration(insights.medianTimeToDeploy)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Projects */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#4A5568]">Recent Projects</CardTitle>
              <CardDescription>
                Your latest business ideas and their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] hover:border-[#F7DC6F] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#4A5568] truncate">
                          {project.idea}
                        </h3>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Status: <span className="capitalize">{project.status.replace('_', ' ')}</span>
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Link
                          href={`/plan/review/${project.id}`}
                          className="text-xs text-[#D4A574] hover:text-[#F7DC6F] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Insights */}
          {recentInsights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#4A5568]">Project Timeline</CardTitle>
                <CardDescription>
                  How long each project took to complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInsights.slice(0, 5).map((projectInsight) => (
                    <div
                      key={projectInsight.projectId}
                      className="p-4 rounded-lg border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]"
                    >
                      <div className="text-sm font-medium text-[#4A5568] mb-2 truncate">
                        {projectInsight.idea}
                      </div>
                      <div className="space-y-1">
                        {projectInsight.timeToPRD > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[#6B7280]">PRD:</span>
                            <span className="text-[#8B7355]">{formatDuration(projectInsight.timeToPRD)}</span>
                          </div>
                        )}
                        {projectInsight.timeToUX > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[#6B7280]">UX:</span>
                            <span className="text-[#8B7355]">{formatDuration(projectInsight.timeToUX)}</span>
                          </div>
                        )}
                        {projectInsight.timeToDeploy > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[#6B7280]">Deploy:</span>
                            <span className="text-[#8B7355]">{formatDuration(projectInsight.timeToDeploy)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-[#4A5568]">Total:</span>
                          <span className="text-[#8B7355]">{formatDuration(projectInsight.totalDuration)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/idea"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] rounded-lg hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02] font-medium"
            >
              Start New Project
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center px-6 py-3 border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] rounded-lg hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all font-medium"
            >
              View Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}