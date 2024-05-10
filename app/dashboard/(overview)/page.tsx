'use client';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/button';
import { lusitana } from '@/components/fonts';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

interface CountObject {
  userCount: number;
  totalMedicine: number;
  totalOrder: number;
  docCount: number;
}

export default function Page() {
  const supabase = createClient();
  const [onRefresh, setResfresh] = useState<boolean>(false);
  const [count, setCount] = useState<CountObject>({
    userCount: 0,
    totalMedicine: 0,
    totalOrder: 0,
    docCount: 0,
  });
  const [pendingOrders, setPendingOrders] = useState<any[]>();
  const [deliveringOrder, setDeliveringOrders] = useState<any[]>();
  const [appointmentPending, setAppointmentPending] = useState<any[]>();
  const [doctorActive, setDoctorActive] = useState<any[]>();

  const refresh = () => {
    setResfresh((prev) => !prev);
  };
  const getCounts = useCallback(async () => {
    try {
      const { data: userData } = await supabase.from('users').select('*');
      const { data: medicinesData } = await supabase
        .from('medicines')
        .select('*');
      const { data: allOrdersData } = await supabase.from('orders').select('*');
      const { data: pendingOrdersData } = await supabase
        .from('doctors')
        .select('*');

      const totalUserCount = userData ? userData.length : 0;
      const totalMedicineCount = medicinesData ? medicinesData.length : 0;
      const totalOrderCount = allOrdersData ? allOrdersData.length : 0;
      const docCount = pendingOrdersData ? pendingOrdersData.length : 0;

      setCount({
        userCount: totalUserCount,
        totalMedicine: totalMedicineCount,
        totalOrder: totalOrderCount,
        docCount,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [supabase]);

  useEffect(() => {
    getCounts();
  }, [getCounts, onRefresh]);

  const fetchPending = useCallback(async () => {
    const { data: pends, error } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'pending')
      .order('id', { ascending: true });
    if (error) {
      console.log('PendError', error);
    } else {
      setPendingOrders(pends);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending, onRefresh]);

  const fetchDelivering = useCallback(async () => {
    const { data: dels, error } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'delivering')
      .order('id', { ascending: true });
    if (error) {
      console.log('DelError', error);
    } else {
      setDeliveringOrders(dels);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDelivering();
  }, [fetchDelivering, onRefresh]);

  const fetchAppointment = useCallback(async () => {
    const { data: apps, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('done', false)
      .order('id', { ascending: true });
    if (error) {
      console.log('DelError', error);
    } else {
      setAppointmentPending(apps);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment, onRefresh]);

  const fetchDoctors = useCallback(async () => {
    const { data: docs, error } = await supabase
      .from('doctors')
      .select('name')
      .eq('available', true)
      .order('id', { ascending: true });
    if (error) {
      console.log('DelError', error);
    } else {
      setDoctorActive(docs);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors, onRefresh]);

  return (
    <main className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-gray-50 p-5">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Overview
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-start gap-5 overflow-hidden">
        <div className="grid h-auto w-full grid-cols-1 flex-col gap-5 md:grid-cols-4">
          <div
            className="flex grow flex-col rounded-lg border-[1px] p-5"
            style={{
              borderColor: COLOR_PALETTE2.darkblue,
              backgroundColor: COLOR_PALETTE2.lightblue,
            }}
          >
            <h2 className="font-[800]">Total User</h2>
            <p className="text-[24px]">{count.userCount}</p>
          </div>
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
            <h2 className="font-[800]">Total Doctors</h2>
            <p className="text-[24px]">{count.docCount}</p>
          </div>
        </div>
        <div className="flex h-full w-full grow flex-col overflow-hidden rounded-lg">
          <div className="p-3">
            <h2 className="text-xl font-[800]">Quick Overview</h2>
          </div>
          <div className="flex h-full flex-col gap-14 overflow-hidden md:flex-row">
            <div
              className="flex w-max flex-col gap-5 overflow-auto rounded-lg border-[1px] p-5 px-8"
              style={{ borderColor: COLOR_PALETTE2.lightblue }}
            >
              <h1 className="mb-3 border-b pb-2 text-lg font-bold text-gray-500">
                Order to prepare
              </h1>
              {pendingOrders && pendingOrders?.length ? (
                pendingOrders?.map((item, index) => {
                  return (
                    <Link
                      href={'/dashboard/orders'}
                      key={index}
                      className="w-full rounded-lg"
                    >
                      <p
                        className="w-full rounded-lg p-3"
                        style={{ backgroundColor: COLOR_PALETTE2.lightgreen }}
                      >
                        Order id: {item.id}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <p>No Pending Orders</p>
              )}
            </div>
            <div
              className="flex w-max flex-col gap-5 overflow-auto rounded-lg border-[1px] p-5 px-8"
              style={{ borderColor: COLOR_PALETTE2.lightblue }}
            >
              <h1 className="mb-3 border-b pb-2 text-lg font-bold text-gray-500">
                Order Delivering
              </h1>
              {deliveringOrder && deliveringOrder?.length ? (
                deliveringOrder?.map((item, index) => {
                  return (
                    <Link
                      href={'/dashboard/orders'}
                      key={index}
                      className="w-full"
                    >
                      <p
                        className="rounded-lg p-3"
                        style={{ backgroundColor: COLOR_PALETTE2.lightgreen }}
                      >
                        Order id: {item.id}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <p>No Order</p>
              )}
            </div>
            <div
              className="flex w-max flex-col gap-5 overflow-auto rounded-lg border-[1px] p-5 px-8"
              style={{ borderColor: COLOR_PALETTE2.lightblue }}
            >
              <h1 className="mb-3 border-b pb-2 text-lg font-bold text-gray-500">
                Appointment Pending
              </h1>
              {appointmentPending && appointmentPending?.length ? (
                appointmentPending?.map((item, index) => {
                  return (
                    <Link
                      href={'/dashboard/appointments'}
                      key={index}
                      className="w-full"
                    >
                      <p
                        className="rounded-lg p-3"
                        style={{ backgroundColor: COLOR_PALETTE2.lightgreen }}
                      >
                        Serial id: {item.id}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <p>No appointments</p>
              )}
            </div>
            <div
              className="flex h-full w-max flex-col gap-5 overflow-scroll rounded-lg border-[1px] p-5 px-8"
              style={{ borderColor: COLOR_PALETTE2.lightblue }}
            >
              <h1 className="mb-3 border-b pb-2 text-lg font-bold text-gray-500">
                Doctor Active
              </h1>
              {doctorActive && doctorActive?.length ? (
                doctorActive?.map((item, index) => {
                  return (
                    <Link
                      href={'/dashboard/doctors'}
                      key={index}
                      className="w-full"
                    >
                      <p
                        className="rounded-lg p-3"
                        style={{ backgroundColor: COLOR_PALETTE2.lightgreen }}
                      >
                        Doctor id: {item.name}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <p>No Doctor Active</p>
              )}
            </div>
          </div>
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
