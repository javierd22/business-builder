"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { Telemetry } from "@/lib/telemetry";
import { shouldShowResearch } from "@/lib/flags";
import { getVariant } from "@/lib/experiments";
import { recordEvent } from "@/lib/observability";
import { setStatus } from "@/lib/assumptions";
import { recordSurvey } from "@/lib/research-telemetry";
import MicroSurvey from "@/app/_components/MicroSurvey";

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
    description: "For growing businesses with advanced needs",
    features: [
      "Unlimited projects",
      "Advanced PRD generation",
      "Premium UX design",
      "All export formats (PDF, JSON)",
      "Priority support",
      "Custom templates",
      "Team collaboration",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "primary" as const,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99",
    period: "per month",
    description: "For agencies and enterprise teams",
    features: [
      "Everything in Pro",
      "White-label options",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
      "SSO authentication",
      "Custom branding",
    ],
    cta: "Contact Sales",
    ctaVariant: "secondary" as const,
    popular: false,
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [ctaVariant, setCtaVariant] = useState('A');
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyTier, setSurveyTier] = useState<string>('');
  const showPricing = true; // Always show pricing for now

  useEffect(() => {
    if (showPricing) {
      Telemetry.pricingPageViewed();
      
      // Record page view for funnel tracking
      recordEvent({
        name: 'view',
        route: '/pricing',
        ok: true,
        ms: 0
      });
      
      // Get CTA variant for experiment
      const variant = getVariant('pricing_cta_label_v1');
      setCtaVariant(variant);
    }
  }, [showPricing]);

  const handleCtaClick = (tierId: string) => {
    setIsLoading(true);
    
    // Record CTA click for funnel tracking  
    recordEvent({
      name: 'cta',
      route: '/pricing',
      ok: true,
      ms: 0,
      meta: { 
        action: 'pricing-cta',
        tier: tierId,
        variant: ctaVariant
      }
    });

    // Show survey for paid tiers if research is enabled
    if (tierId !== 'free' && shouldShowResearch()) {
      setSurveyTier(tierId);
      setShowSurvey(true);
    }

    // Simulate CTA processing
    setTimeout(() => {
      setIsLoading(false);
      // Here you would normally redirect to payment or signup
      console.log(`CTA clicked for tier: ${tierId}`);
    }, 1000);
  };

  const handleSurveySubmit = (result: { choice: string; note?: string }) => {
    recordSurvey('pricing_wtp', result.choice, result.note);
    
    // Update assumption status based on response
    if (result.choice === 'Yes') {
      setStatus('pricing_wtp', 'validated', result.note);
    } else if (result.choice === 'No') {
      setStatus('pricing_wtp', 'invalidated', result.note);
    }
    
    setShowSurvey(false);
    setSurveyTier('');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#4A5568] mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core AI-powered business planning tools.
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
                  onClick={() => handleCtaClick(tier.id)}
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
                All your business plans and data are stored locally in your browser. We never store your content on our servers.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-[#6B7280]">
                Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                Is there a free trial?
              </h3>
              <p className="text-[#6B7280]">
                The Free plan is available forever. Pro and Premium plans include a 14-day free trial.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-[#FFF9E6] via-[#FFF4C4] to-[#FFECB3] rounded-2xl p-12 shadow-[0_8px_32px_rgba(247,220,111,0.2)]">
            <h2 className="text-3xl font-bold text-[#4A5568] mb-4">
              Ready to Transform Your Business Ideas?
            </h2>
            <p className="text-lg text-[#6B7280] mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs and business owners who are building better business plans with AI.
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

          {/* Research Survey */}
          {showSurvey && shouldShowResearch() && (
            <div className="mt-12 max-w-2xl mx-auto">
              <MicroSurvey
                assumptionId="pricing_wtp"
                question={`Would you pay for ${surveyTier === 'pro' ? 'Pro' : 'Premium'} at this price?`}
                options={["Yes", "No", "Maybe"]}
                onSubmit={handleSurveySubmit}
                variant="box"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}