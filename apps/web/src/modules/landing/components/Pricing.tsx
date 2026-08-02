'use client';

import React from 'react';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  unit?: string;
  payAsYouGo?: string;
  ctaText: string;
  ctaHref: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'developer',
    name: 'Developer',
    subtitle: 'For solo users getting started.',
    price: '$0',
    unit: '/ seat per month',
    payAsYouGo: 'then pay as you go',
    ctaText: 'Start for free',
    ctaHref: '/auth/signup',
    features: ['Up to 5k base traces / mo, then pay-as-you-go', 'Community support', '1 seat'],
  },
  {
    id: 'plus',
    name: 'Plus',
    subtitle: 'For teams building and deploying agents.',
    price: '$39',
    unit: '/ seat per month',
    payAsYouGo: 'then pay as you go',
    ctaText: 'Sign up',
    ctaHref: '/auth/signup',
    features: [
      'Up to 10k base traces / mo, then pay-as-you-go',
      'Access to Deployment, Engine, and more',
      'Add unlimited seats',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'For teams with advanced hosting, security, and support needs.',
    price: 'Custom pricing',
    ctaText: 'Contact sales',
    ctaHref: '#contact',
    features: [
      'Self-hosted and hybrid deployment options',
      'Custom SSO, ABAC, and RBAC',
      'Support SLA',
      'Custom seats and workspaces',
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-20 font-cabin scroll-mt-20 mt-[7rem] "
    >
      <div className="">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-[-1.5px] text-neutral-900 leading-tight">
            Plans for teams of any size
          </h2>
          <p className="mt-4 text-xs sm:text-sm  text-neutral-600 tracking-tight">
            Get access to each Relic AI service - pay for what you use.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between bg-white rounded-2xl sm:rounded-[5px] border border-black/10 p-7 sm:p-9 shadow-xs transition-all duration-300"
            >
              <div>
                {/* Title & Monospace Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900">
                  {plan.name}
                </h3>
                <p className="font-mono text-xs sm:text-[13px] text-neutral-500 mt-2 min-h-[36px] leading-relaxed">
                  {plan.subtitle}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-1 flex items-baseline flex-wrap gap-x-1.5">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
                    {plan.price}
                  </span>
                  {plan.unit && (
                    <span className="text-xl sm:text-2xl font-normal text-neutral-900">
                      {plan.unit}
                    </span>
                  )}
                </div>

                {/* Pay as you go note */}
                <div className="h-6 mb-6">
                  {plan.payAsYouGo ? (
                    <p className="font-mono text-xs text-neutral-400">{plan.payAsYouGo}</p>
                  ) : (
                    <span className="block" />
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.ctaHref}
                  className="block w-full text-center py-3 px-4 rounded-md bg-[#09090b] hover:bg-black text-white font-mono text-xs sm:text-sm tracking-wide transition-colors duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  {plan.ctaText}
                </Link>

                {/* Feature List */}
                <ul className="mt-8 space-y-3.5 text-xs sm:text-sm text-neutral-700">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-snug">
                      <span className="text-[#0066ff] font-bold text-base leading-none select-none">
                        •
                      </span>
                      <span className="text-neutral-700 font-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
