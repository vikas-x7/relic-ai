'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { BiLogoGithub } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';

type ProviderMap = Awaited<ReturnType<typeof getProviders>>;

const authErrors: Record<string, string> = {
  AccessDenied: 'Sign in was cancelled or access was denied.',
  Callback: 'OAuth callback could not be completed. Check provider settings.',
  OAuthAccountNotLinked:
    'This email is linked with another sign-in method. Try that method instead.',
  OAuthCallback:
    'Provider callback failed. Check client ID, client secret, and callback URL.',
  OAuthCreateAccount: 'Could not create account. Please try again later.',
  Configuration:
    'Auth providers are not configured. Add environment variables.',
  Default: 'Sign in failed. Please try again.',
};

type LoginPageProps = {
  error?: string;
};

export default function LoginPage({ error }: LoginPageProps) {
  const [providers, setProviders] = useState<ProviderMap>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProviders() {
      const availableProviders = await getProviders();

      if (isMounted) {
        setProviders(availableProviders);
      }
    }

    void loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  const errorMessage = error ? (authErrors[error] ?? authErrors.Default) : null;

  const providersLoaded = providers !== null;
  const hasConfiguredProviders =
    !!providers && Object.keys(providers).length > 0;

  function handleSignIn(providerId: 'google' | 'github') {
    if (!providers?.[providerId]) {
      return;
    }

    setActiveProvider(providerId);
    void signIn(providerId, { callbackUrl: '/chat' });
  }

  return (
    <div className="font-DM_sans flex min-h-screen bg-black text-white">
      <div className="relative hidden border-r border-white/20 lg:block lg:w-1/2">
        <Image
          width={1000}
          height={1000}
          src="/images/relicailoginimage.jpg"
          alt=""
          className="h-screen w-full object-cover opacity-40"
        />

        <div className="absolute bottom-[3%] left-[3%]">
          <p className="-mb-3 text-start text-[30px] font-medium -tracking-[2px]">
            Don&apos;t Go with flow
          </p>
          <h1 className="text-[100px] leading-25 font-semibold -tracking-[8px]">
            Start using relic ai
          </h1>
          <div></div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="absolute top-0 left-0 mt-3 ml-3 flex items-center">
          <img src="/images/logo.png" alt="" className="h-11 w-11" />
          <h1 className="-ml-2 text-[20px]">Relic ai</h1>
        </div>
        <div className="w-[480px] px-6">
          <div className="mb-8 flex flex-col items-center justify-center">
            <h1 className="flex items-center gap-2 text-[30px] font-medium -tracking-[1.5px]">
              Welcome to Relic AI
            </h1>
            <p className="mt-1 text-center text-[12px] text-white/50">
              Your ideas, your nodes, your branches all waiting for you. Sign in
              to continue.
            </p>
          </div>

          {errorMessage ? (
            <div className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-left text-xs text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {providersLoaded && !hasConfiguredProviders ? (
            <div className="mb-4 border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-700">
              To enable Google and GitHub authentication, add provider
              credentials in your `.env` file.
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleSignIn('google')}
              disabled={!providers?.google || activeProvider !== null}
              className="w-full rounded-[2px] border border-neutral-300 bg-white py-2 text-[14px] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-1 font-medium -tracking-[0.5px]">
                <FcGoogle size={19} />
                {activeProvider === 'google'
                  ? 'Continue with Google'
                  : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSignIn('github')}
              disabled={!providers?.github || activeProvider !== null}
              className="w-full rounded-[2px] border border-neutral-300 bg-white py-2 text-[14px] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-1 font-medium -tracking-[0.5px]">
                <BiLogoGithub size={19} />
                {activeProvider === 'github'
                  ? 'Continue with GitHub'
                  : 'Continue with GitHub'}
              </span>
            </button>
          </div>

          <p className="absolute bottom-10 border-t border-white/10 py-2 text-start text-[11px] text-neutral-600">
            Terms & Conditions Continuing means <br /> you agree to our Terms of
            Service and Privacy Policy. Your data stays yours, always.
          </p>
        </div>
      </div>
    </div>
  );
}
