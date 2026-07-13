'use client';

import { useState } from 'react';
import { BiLogoGithub } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { useProviders } from '@/src/modules/auth/hooks/useAuth';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authErrors: Record<string, string> = {
  invalid_state: 'Session expired. Please try again.',
  no_code: 'Authentication failed. No code received.',
  exchange_failed: 'Authentication failed. Please try again.',
  default: 'Sign in failed. Please try again.',
};

type LoginPageProps = {
  error?: string;
};

export default function LoginPage({ error }: LoginPageProps) {
  const { data: providers } = useProviders();
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const errorMessage = error ? (authErrors[error] ?? authErrors.default) : null;

  function handleSignIn(provider: 'google' | 'github') {
    setActiveProvider(provider);
    window.location.href = `${API_URL}/auth/${provider}`;
  }

  return (
    <div className="font-DM_sans flex min-h-dvh bg-black text-white font-cabin">
      <div className="relative hidden  lg:block lg:w-1/2">
        <Image
          width={1200}
          height={600}
          priority
          src="/images/loginImage.webp"
          alt=""
          className="h-dvh w-full object-cover opacity-40 grayscale-0"
        />
        <div className="absolute bottom-[3%] left-[3%]">
          <p className="-mb-3 text-start text-[1.875rem] font-medium -tracking-[0.125rem]">
            Don&apos;t Go with flow
          </p>
          <h1 className="text-[6.25rem] leading-25 font-semibold -tracking-[0.5rem]">
            Start using relic ai
          </h1>
        </div>
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="absolute top-0 left-0 mt-3 ml-3 flex items-center">
          <img src="https://relicai.in/images/logo.png" alt="" className="h-11 w-11" />
          <h1 className="-ml-2 text-[1.25rem]">Relic ai</h1>
        </div>
        <div className="w-[480px] px-[1.5em]">
          <div className="mb-8 flex flex-col items-center justify-center">
            <h1 className="flex items-center gap-2 text-[1.875rem] font-medium -tracking-[0.0937rem]">
              Welcome to Relic AI
            </h1>
            <p className="mt-1 text-center text-[0.75rem] text-white/60">
              Your ideas, your nodes, your branches all waiting for you. Sign in to continue.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 border border-red-200 bg-red-50 px-[0.75em] py-[0.5em] text-left text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleSignIn('google')}
              disabled={!providers?.google || activeProvider !== null}
              className="w-full rounded-[2px] border border-neutral-300 bg-white py-[0.5em] text-[0.875rem] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-1 font-medium -tracking-[0.03125rem]">
                <FcGoogle size={19} />
                {activeProvider === 'google' ? 'Log in...' : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSignIn('github')}
              disabled={!providers?.github || activeProvider !== null}
              className="w-full rounded-[2px] border border-neutral-300 bg-white py-[0.5em] text-[0.875rem] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-1 font-medium -tracking-[0.03125rem]">
                <BiLogoGithub size={19} />
                {activeProvider === 'github' ? 'Log in...' : 'Continue with GitHub'}
              </span>
            </button>
          </div>

          <p className="absolute bottom-10 border-t border-white/10 py-2 text-start text-[11px] text-neutral-600">
            Terms & Conditions Continuing means <br /> you agree to our Terms of Service and Privacy
            Policy. Your data stays yours, always.
          </p>
        </div>
      </div>
    </div>
  );
}
