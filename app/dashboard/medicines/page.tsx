'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Medicines } from '@/lib/types/supabase';
import { MedicineTable } from '@/components/medicines/data-table';
import { NewMedicine } from '@/components/medicines/add-new';
import { lusitana } from '@/components/fonts';
import { Button } from '@/components/button';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';
import { EditMedicine } from '@/components/medicines/edit-medicine';

export default function Page() {
  const supabase = createClient();
  const [medecine, setMedecines] = useState<Medicines[]>([]);
  const [onRefresh, setResfresh] = useState<boolean>(false);
  const [editData, setEditData] = useState({
    id: 0,
    title: '',
    type: 'tab',
    price: 0,
    visible: false,
    description: '',
  });

  const refresh = () => {
    setResfresh((prev) => !prev);
  };

  const handleEditData = async (id: number) => {
    const { data } = await supabase
      .from('medicines')
      .select('id, title, type, price, description')
      .eq('id', id);

    setEditData({
      id: data && data[0].id,
      title: data && data[0]?.title,
      price: data && data[0]?.price,
      type: data && data[0].type,
      description: data && data[0].description,
      visible: true,
    });
  };

  const fetchMedicines = useCallback(async () => {
    const { data: meds, error } = await supabase
      .from('medicines')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.log('MedError', error);
    } else {
      setMedecines(meds);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines, onRefresh]);

  return (
    <main className="flex  w-full flex-col">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Medicines
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-4 md:gap-20">
        <div className="w-[70%]">
          <h2 className=" mb-4 text-xl font-bold text-gray-800">
            All Medicines
          </h2>
          <MedicineTable data={medecine} editMedicine={handleEditData} />
        </div>
        <div className="flex min-w-[70%] flex-col  gap-10">
          {editData && editData.visible ? (
            <div>
              <h2 className=" mb-4 text-xl font-bold text-gray-800">
                Edit Medicine
              </h2>
              <EditMedicine
                medDetails={editData}
                supabase={supabase}
                onComp={() => setEditData({ ...editData, visible: false })}
              />
            </div>
          ) : null}
          <div className="w-full">
            <h2 className=" mb-4 text-xl font-bold text-gray-800">
              Add New Medicine
            </h2>
            <NewMedicine />
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
