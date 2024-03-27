import Logo from '@/components/logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
// import { useSupabaseClient } from '@supabase/auth-helpers-react';
// import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import styles from '@/components/home.module.css';
import Link from 'next/link';
import { lusitana } from '@/components/fonts';
import AuthForm from '@/components/auth/auth-form';
import clsx from 'clsx';
import { COLOR_PALETTE, COLOR_PALETTE2 } from '@/components/variables';

export default function Page() {
  return (
    <main className="flex h-[100vh] min-h-screen flex-col p-6">
      <div
        className="flex h-[10%] shrink-0 items-end rounded-lg p-4 md:h-[15%]"
        style={{
          backgroundColor: COLOR_PALETTE2.darkblue,
        }}
      >
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-[30%] md:px-10">
          <div className={styles.shape} />
          <p
            className={`${lusitana.className} text-xl text-gray-800 antialiased md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to MeDDose Admin Panel.</strong>
          </p>
          <div
            className="flex items-center justify-center gap-5 self-start rounded-lg border-[1px]  px-6 py-3 text-sm font-medium md:text-base"
            style={{
              backgroundColor: COLOR_PALETTE2.lightblue,
              borderColor: COLOR_PALETTE2.darkblue,
            }}
          >
            <span>Log in</span>
            <ArrowRightIcon className="w-5" color={COLOR_PALETTE2.darkblue} />
          </div>
        </div>
        <div className="flex grow items-center justify-center">
          <div className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-lg bg-gray-50 p-5 text-base md:p-20">
            <span
              className={clsx(
                'align-center mx-4 mb-1 w-[60%] pb-2 text-center font-sans text-4xl font-[600]',
                lusitana.className,
              )}
            >
              Login
            </span>
            <div className="flex w-full justify-center">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
