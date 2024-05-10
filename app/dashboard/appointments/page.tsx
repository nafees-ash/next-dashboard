'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Appointment, Medicines } from '@/lib/types/supabase';

import { lusitana } from '@/components/fonts';
import { Button } from '@/components/button';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';

import { AppointmentTable } from '@/components/appointments/data-table';
import { EditAppointment } from '@/components/appointments/edit-data';

export default function Page() {
  const supabase = createClient();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [onRefresh, setResfresh] = useState<boolean>(false);
  const [editData, setEditData] = useState({
    id: 0,
    booked_by: '',
    doctor: 0,
    doctor_name: '',
    done: false,
    visible: false,
  });

  const refresh = () => {
    setResfresh((prev) => !prev);
  };

  const handleEditData = async (id: number) => {
    const { data } = await supabase
      .from('appointments')
      .select('id, booked_by, doctor, doctor_name, done ')
      .eq('id', id);
    console.log(id);
    setEditData({
      id: data && data[0].id,
      booked_by: data && data[0]?.booked_by,
      doctor: data && data[0]?.doctor,
      doctor_name: data && data[0]?.doctor_name,
      done: data && data[0].done,
      visible: true,
    });
  };

  const fetchAppointments = useCallback(async () => {
    const { data: meds, error } = await supabase
      .from('appointments')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.log('AppointmentError', error);
    } else {
      setAppointments(meds);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, onRefresh]);

  return (
    <main className="flex  w-full flex-col">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Appointment
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-4 md:gap-20">
        <div className="w-[70%]">
          <h2 className=" mb-4 text-xl font-bold text-gray-800">
            All Appointment
          </h2>
          <AppointmentTable
            data={appointments}
            editAppointment={handleEditData}
          />
        </div>
        <div className="flex min-w-[70%] flex-col gap-10">
          {editData && editData.visible ? (
            <div>
              <h2 className=" mb-4 text-xl font-bold text-gray-800">
                Edit Appointment
              </h2>
              <EditAppointment
                apointpDetails={editData}
                supabase={supabase}
                onComp={() => setEditData({ ...editData, visible: false })}
              />
            </div>
          ) : null}
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
