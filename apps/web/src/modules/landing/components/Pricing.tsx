'use client';

import React, { useState } from 'react';

type BillingCycle = 'monthly' | 'annual';

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
}

const plans: Plan[] = [
  {
    id: 'basic-10',
    name: 'Basic plan',
    monthlyPrice: 10,
    annualPrice: 8.5,
    description: 'Select one or more styles that fit your taste',
    features: [
      'Spatial canvas access',
      'Up to 50 active nodes',
      'Standard AI model access',
      'Persistent memory history',
    ],
  },
  {
    id: 'basic-40',
    name: 'Pro plan',
    monthlyPrice: 40,
    annualPrice: 34,
    description: 'Select one or more styles that fit your taste',
    features: [
      'Unlimited spatial nodes & branches',
      'Priority AI model generation',
      'Deep context memory storage',
      'Export canvas & code blocks',
    ],
  },
  {
    id: 'basic-60',
    name: 'Enterprise plan',
    monthlyPrice: 60,
    annualPrice: 51,
    description: 'Select one or more styles that fit your taste',
    features: [
      'Unlimited everything & custom agents',
      'Dedicated high-speed neural server',
      'Team canvas collaboration',
      '24/7 Priority support & API access',
    ],
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 py-20 font-cabin mx-auto">
      {/* Top Bar: Title & Billing Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 sm:mb-16 gap-6">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
          Subscription
        </h2>

        {/* Monthly / Annual Toggle Pill */}
        <div className="flex items-center bg-neutral-100 p-1.5 text-xs sm:text-sm font-medium border border-neutral-200/80">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-[5px] px-5 py-2 transition-all duration-200 cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 transition-all duration-200 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            <span>Annual</span>
            <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
              -15%
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

          return (
            <div
              key={plan.id}
              className="relative flex flex-col justify-between rounded-[3px] border border-dashed border-neutral-200/90 bg-neutral-50/40 p-6 sm:p-8 transition-all duration-300 hover:border-neutral-400 hover:bg-white hover:shadow-xl group"
            >
              <div>
                {/* Plan Title */}
                <span className="text-xs sm:text-sm font-medium text-neutral-400">{plan.name}</span>

                {/* Price */}
                <div className="mt-3 mb-4 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
                    ${price}
                  </span>
                  <span className="ml-1 text-xs text-neutral-400 font-normal">
                    {billingCycle === 'annual' ? '/mo (billed annually)' : '/mo'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-8">
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-10 text-xs sm:text-sm text-neutral-500">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-neutral-400">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Subscribe Button */}
              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-2xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm flex items-center justify-center gap-2 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:scale-110"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                <span>Subscribe</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
