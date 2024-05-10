'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Doctor, Medicines } from '@/lib/types/supabase';

import { lusitana } from '@/components/fonts';
import { Button } from '@/components/button';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';

import { DoctorTable } from '@/components/doctors/data-table';
import { NewDoctor } from '@/components/doctors/add-new';
import { EditDoctor } from '@/components/doctors/edit-data';

export default function Page() {
  const supabase = createClient();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [onRefresh, setResfresh] = useState<boolean>(false);
  const [editData, setEditData] = useState({
    id: 0,
    name: '',
    schedule: '',
    available: true,
    expertise: '',
    hospital: '',
    degree: '',
    visible: false,
  });

  const refresh = () => {
    setResfresh((prev) => !prev);
  };

  const handleEditData = async (id: number) => {
    const { data } = await supabase
      .from('doctors')
      .select('id, name, degree, expertise, available, hospital, schedule ')
      .eq('id', id);
    console.log(id);
    setEditData({
      id: data && data[0].id,
      name: data && data[0]?.name,
      schedule: data && data[0]?.schedule,
      available: data && data[0].available,
      degree: data && data[0].degree,
      expertise: data && data[0].expertise,
      hospital: data && data[0].hospital,
      visible: true,
    });
  };

  const fetchDoctors = useCallback(async () => {
    const { data: meds, error } = await supabase
      .from('doctors')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.log('DocError', error);
    } else {
      setDoctors(meds);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors, onRefresh]);

  return (
    <main className="flex  w-full flex-col">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Doctor
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-4 md:gap-20">
        <div className="w-[70%]">
          <h2 className=" mb-4 text-xl font-bold text-gray-800">All Doctor</h2>
          <DoctorTable data={doctors} editDoctor={handleEditData} />
        </div>
        <div className="flex min-w-[70%] flex-col gap-10">
          {editData && editData.visible ? (
            <div>
              <h2 className=" mb-4 text-xl font-bold text-gray-800">
                Edit Doctor
              </h2>
              <EditDoctor
                docDetails={editData}
                supabase={supabase}
                onComp={() => setEditData({ ...editData, visible: false })}
              />
            </div>
          ) : null}
          <div className="w-full">
            <h2 className=" mb-4 text-xl font-bold text-gray-800">
              Add New Doctor
            </h2>
            <NewDoctor />
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
