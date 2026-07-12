'use client';

import Image from 'next/image';

type WelcomeOverlayProps = {
  visible: boolean;
  userName?: string | null;
};

export default function WelcomeOverlay({ visible, userName }: WelcomeOverlayProps) {
  return (
    <div
      aria-hidden={visible}
      className={`pointer-events-none absolute top-55 right-130 z-20 flex w-100 items-center text-white/70 transition-all duration-500 ease-out ${
        visible ? '-translate-y-4 scale-95 opacity-0' : 'translate-y-0 scale-100 opacity-100'
      }`}
    >
      <div className="flex-col items-center text-center">
        <div className="flex items-center">
          <Image src="/images/logo.png" alt="" width={80} height={80} className="w-17 opacity-80" />
          <div>
            <h1 className="-ml-[16px] text-[35px] font-semibold -tracking-[1px]">Relic AI</h1>
          </div>
        </div>
        <p className="-mt-3 px-5">Welcome back {userName || 'User'} to relic ai</p>
      </div>
    </div>
  );
}
