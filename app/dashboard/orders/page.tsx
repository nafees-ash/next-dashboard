'use client';
import { Button } from '@/components/button';
import { lusitana } from '@/components/fonts';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [onRefresh, setResfresh] = useState<boolean>(false);

  const refresh = () => {
    setResfresh((prev) => !prev);
  };

  return (
    <main>
      <h2
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Orders
      </h2>
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
