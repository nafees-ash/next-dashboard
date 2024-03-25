'use client';

import { lusitana } from '@/components/fonts';
import AuthFormSignUp from '@/components/auth/auth-form-signup';
import { createClient } from '@/app/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import ChangePass from '@/components/profile/change-pass';
import { Button } from '@/components/button';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';

export default function Page() {
  const supabase = createClient();
  const [user, setUser] = useState<string>();
  const [onRefresh, setResfresh] = useState<boolean>(false);

  const refresh = () => {
    setResfresh((prev) => !prev);
  };

  const getUsername = useCallback(async () => {
    const user = (await supabase.auth.getUser()).data?.user?.id;
    const data = await supabase.from('admin').select('name').eq('uid', user);
    if (data) {
      setUser(data.data && data.data[0]?.name);
    }
  }, [supabase]);

  useEffect(() => {
    getUsername();
  }, [getUsername]);

  return (
    <main className="flex h-full w-full flex-col">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        {'Admin Name' || user}
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-4 md:flex-row md:gap-20">
        <div>
          <h2 className=" mb-4 text-xl font-bold text-gray-800">
            Change Password
          </h2>
          <ChangePass />
        </div>
        <div>
          <h2 className=" mb-4 text-xl font-bold text-gray-800">
            Create New Admin
          </h2>
          <AuthFormSignUp />
        </div>
      </div>
      <Button
        className="absolute bottom-7 right-7 flex w-max gap-2 rounded-lg border-[1px] p-3 text-black hover:bg-blue-200"
        style={{
          backgroundColor: COLOR_PALETTE2.lightblue,
          borderColor: COLOR_PALETTE2.darkblue,
        }}
        onClick={refresh}
      >
        <RefreshCcwIcon color={COLOR_PALETTE2.darkblue} size={16} />
        <p className="text-black">Refresh</p>
      </Button>
    </main>
  );
}
