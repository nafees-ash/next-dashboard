'use client';
import { createClient } from '@/app/lib/supabase/client';
import { Button } from '@/components/button';
// import { Card } from '@/components/dashboard/cards';
// import RevenueChart from '@/components/dashboard/revenue-chart';
// import LatestInvoices from '@/components/dashboard/latest-invoices';
import { lusitana } from '@/components/fonts';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
// import AuthFormSignUp from '@/components/auth/auth-form-signup';
// import { createClient } from '@/app/lib/supabase/client';
// import { useCallback, useEffect, useState } from 'react';

interface CountObject {
  totalMedicine: number;
  totalOrder: number;
  pendingOrder: number;
}

export default function Page() {
  const supabase = createClient();
  const [onRefresh, setResfresh] = useState<boolean>(false);
  const [count, setCount] = useState<CountObject>({
    totalMedicine: 0,
    totalOrder: 0,
    pendingOrder: 0,
  });

  const refresh = () => {
    setResfresh((prev) => !prev);
  };
  const getCounts = useCallback(async () => {
    try {
      const { data: medicinesData } = await supabase
        .from('medicines')
        .select('*');
      const { data: allOrdersData } = await supabase.from('orders').select('*');
      const { data: pendingOrdersData } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending');

      const totalMedicineCount = medicinesData ? medicinesData.length : 0;
      const totalOrderCount = allOrdersData ? allOrdersData.length : 0;
      const pendingOrderCount = pendingOrdersData
        ? pendingOrdersData.length
        : 0;

      setCount({
        totalMedicine: totalMedicineCount,
        totalOrder: totalOrderCount,
        pendingOrder: pendingOrderCount,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [supabase]);

  useEffect(() => {
    getCounts();
  }, [getCounts, onRefresh]);

  return (
    // <main>
    //   <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
    //     Dashboard
    //   </h1>
    //   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    //     {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
    //     <Card title="Pending" value={totalPendingInvoices} type="pending" />
    //     <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
    //     {/* <Card
    //       title="Total Customers"
    //       value={numberOfCustomers}
    //       type="customers"
    //     /> */}
    //   </div>
    //   <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
    //     {/* <RevenueChart revenue={revenue} /> */}
    //   </div>
    // </main>
    <main className="flex h-full w-full flex-col">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Overview
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
        <div className="flex w-full gap-5">
          <div
            className="flex grow flex-col rounded-lg border-[1px] p-5"
            style={{
              borderColor: COLOR_PALETTE2.darkblue,
              backgroundColor: COLOR_PALETTE2.lightblue,
            }}
          >
            <h2 className="font-[800]">Total Medecine</h2>
            <p className="text-[24px]">{count.totalMedicine}</p>
          </div>
          <div
            className="flex grow flex-col rounded-lg border-[1px] p-5"
            style={{
              borderColor: COLOR_PALETTE2.darkblue,
              backgroundColor: COLOR_PALETTE2.lightblue,
            }}
          >
            <h2 className="font-[800]">Total Order</h2>
            <p className="text-[24px]">{count.totalOrder}</p>
          </div>
          <div
            className="flex grow flex-col rounded-lg border-[1px] p-5"
            style={{
              borderColor: COLOR_PALETTE2.darkblue,
              backgroundColor: COLOR_PALETTE2.lightblue,
            }}
          >
            <h2 className="font-[800]">Pending Order</h2>
            <p className="text-[24px]">{count.pendingOrder}</p>
          </div>
        </div>
        <div
          className="w-full grow rounded-lg border-[1px]"
          style={{ borderColor: COLOR_PALETTE2.lightblue }}
        ></div>
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
