"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { Telemetry } from "@/lib/telemetry";
import { isFeatureEnabled } from "@/lib/flags";

const PRICING_TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with business planning",
    features: [
      "3 projects per month",
      "Basic PRD generation",
      "Standard UX design",
      "Markdown export",
      "Community support",
    ],
    cta: "Start Free",
    ctaVariant: "secondary" as const,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing businesses and agencies",
    features: [
      "Unlimited projects",
      "Advanced PRD generation",
      "Premium UX design",
      "PDF export",
      "Project import/export",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Get Pro",
    ctaVariant: "primary" as const,
    popular: true,
  },
  {
    id: "founder",
    name: "Founder",
    price: "$99",
    period: "per month",
    description: "For serious entrepreneurs and enterprises",
    features: [
      "Everything in Pro",
      "Custom AI models",
      "White-label options",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "Advanced analytics",
    ],
    cta: "Go Founder",
    ctaVariant: "primary" as const,
    popular: false,
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const showPricing = isFeatureEnabled('showPricing');

  useEffect(() => {
    if (showPricing) {
      Telemetry.pricingPageViewed();
    }
  }, [showPricing]);

  if (!showPricing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[#4A5568] mb-4">Pricing Unavailable</h1>
          <p className="text-lg text-[#6B7280] mb-8">
            Pricing information is currently not available.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] rounded-lg hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02] font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleCtaClick = async (tier: string) => {
    setIsLoading(true);
    
    try {
      Telemetry.pricingCtaClicked(tier);
      Telemetry.tierSelected(tier);
      
      // Simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just show an alert
      alert(`Thank you for your interest in ${tier}! This is a demo - no payment was processed.`);
    } catch (error) {
      console.error('CTA click error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#4A5568] mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={`relative ${
                tier.popular
                  ? 'border-2 border-[#F7DC6F] shadow-[0_8px_32px_rgba(247,220,111,0.2)] scale-105'
                  : 'border border-[#E8E9EA]'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] px-4 py-2 rounded-full text-sm font-medium shadow-[0_2px_8px_rgba(247,220,111,0.3)]">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-[#4A5568] mb-2">
                  {tier.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-[#4A5568]">
                    {tier.price}
                  </span>
                  <span className="text-[#6B7280] ml-2">
                    {tier.period}
                  </span>
                </div>
                <CardDescription className="text-[#6B7280]">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[#4A5568]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCtaClick(tier.id, tier.cta)}
                  disabled={isLoading}
                  className={`w-full ${
                    tier.ctaVariant === 'primary'
                      ? 'bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]'
                      : 'border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all'
                  } disabled:opacity-50 disabled:transform-none`}
                >
                  {isLoading ? 'Processing...' : tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#4A5568] text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-[#6B7280]">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                What happens to my data?
              </h3>
              <p className="text-[#6B7280]">
                Your data is stored locally in your browser. We never access or store your business ideas.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-[#6B7280]">
                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                Is there a free trial?
              </h3>
              <p className="text-[#6B7280]">
                Yes! The Free plan gives you access to all core features with some limitations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F] rounded-2xl p-8 shadow-[0_4px_16px_rgba(247,220,111,0.2)]">
            <h2 className="text-3xl font-bold text-[#4A5568] mb-4">
              Ready to build your business?
            </h2>
            <p className="text-lg text-[#6B7280] mb-6">
              Start with our free plan and upgrade when you&apos;re ready for more features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/idea"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] rounded-lg hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02] font-medium"
              >
                Start Building Now
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
    </div>
  );
}
