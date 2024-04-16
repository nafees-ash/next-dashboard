'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Medicines, Order, SimpleCardProps } from '@/lib/types/supabase';
import { MedicineTable } from '@/components/medicines/data-table';
import { NewMedicine } from '@/components/medicines/add-new';
import { lusitana } from '@/components/fonts';
import { Button } from '@/components/button';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';
import { OrderTable } from '@/components/orders/data-table';
import { SimpleCard } from '@/components/dashboard/cards';

export default function Page() {
  const supabase = createClient();
  const [order, setOrder] = useState<Order[]>([]);
  const [showOrderData, setShowOrderData] = useState<SimpleCardProps>({
    id: 0,
    userId: 0,
    title: '',
    medicine_id: 0,
    medicine_name: '',
    item: 0,
    status: '',
    address: '',
    visible: false,
    order_box: false,
    hasReminder: false,
    reminder: null,
    count: 0,
  });
  const [onRefresh, setResfresh] = useState<boolean>(false);

  const refresh = () => {
    setResfresh((prev) => !prev);
  };

  const handleShowData = useCallback(
    async (id: number) => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id);
      const user =
        data &&
        (await supabase
          .from('users')
          .select('name')
          .eq('uid', data[0].added_by));
      setShowOrderData({
        id: data && data[0].id,
        userId: data && data[0].added_by,
        title: user?.data && user.data[0]?.name,
        medicine_id: data && data[0].medicine_id,
        medicine_name: data && data[0].medicine_name,
        item: data && data[0].medicine_id,
        status: data && data[0].status,
        address: data && data[0].address,
        order_box: data && data[0].order_box,
        hasReminder: data && data[0].hasReminder,
        reminder: data && data[0].reminder,
        count: data && data[0].count,
        visible: true,
      });
    },
    [supabase],
  );

  const fetchMedicines = useCallback(async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.log('MedError', error);
    } else {
      setOrder(orders);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMedicines();
    handleShowData;
  }, [fetchMedicines, onRefresh, handleShowData]);

  return (
    <main className="flex h-full w-full flex-col">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Orders
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-4 md:flex-row md:gap-20">
        <div>
          <h2 className=" mb-4 text-xl font-bold text-gray-800">All Orders</h2>
          <OrderTable data={order} showData={handleShowData} />
        </div>
        <div>
          {showOrderData.visible && (
            <SimpleCard simpleCardData={showOrderData} supabase={supabase} />
          )}
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
