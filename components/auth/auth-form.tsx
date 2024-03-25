'use client';

import { login } from '@/app/auth/actions';
import { COLOR_PALETTE2 } from '../variables';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';

export default function AuthForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  useEffect(() => {
    if (loading) {
      toast({
        description: 'loading...please wait',
      });
    }
    return () => {
      setLoading(false);
    };
  }, [loading, toast]);

  return (
    <form
      className="grid w-[90%] items-center gap-x-5 gap-y-7 rounded-lg border-[1px] p-10 md:w-[70%] "
      style={{
        gridTemplateColumns: '30% 60%',
        borderColor: COLOR_PALETTE2.lightblue,
      }}
    >
      <label htmlFor="email">Email:</label>
      <Input
        id="email"
        name="email"
        type="email"
        required
        className="rounded-lg  p-3"
        style={{ backgroundColor: COLOR_PALETTE2.lightblue }}
      />
      <label htmlFor="password">Password:</label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        className="rounded-lg p-3"
        style={{ backgroundColor: COLOR_PALETTE2.lightblue }}
      />
      <button
        formAction={login}
        className="col-span-2 rounded-lg p-3 text-white hover:bg-blue-200"
        style={{ backgroundColor: COLOR_PALETTE2.darkblue }}
        onClick={() => setLoading(true)}
      >
        Log in
      </button>
    </form>
  );
}
