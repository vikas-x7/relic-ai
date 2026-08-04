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
      className={`pointer-events-none absolute top-60  z-20 flex left-73 items-center text-white transition-all duration-500 ease-out ${
        visible ? '-translate-y-4 scale-95 opacity-0' : 'translate-y-0 scale-100 opacity-100'
      }`}
    >
      <div className="flex-col items-center text-center ">
        <div className="flex items-center gap-1">
          <Image src="/images/logo.png" alt="" width={80} height={80} className="w-8  ml-[9]" />
          <div>
            <h1 className=" text-[35px] font-semibold -tracking-[1px]">Relic AI</h1>
          </div>
        </div>
        <p className="-mt-1 px-3">Welcome back {userName?.split(' ')[0] || 'User'} to relic ai</p>
      </div>
    </div>
  );
}
