'use client';

import Nav from '@/src/modules/landing/components/NavBar';
import Pricing from '@/src/modules/landing/components/Pricing';

export default function PricingPage() {
  return (
    <div className="w-full bg-white text-black min-h-screen relative overflow-x-clip">
      <div className="max-w-[1640px] mx-auto w-full relative">
        <Nav />
        <Pricing />
      </div>
    </div>
  );
}
