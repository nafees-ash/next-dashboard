'use client';

import { createClient } from '@/app/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Medicines } from '@/app/lib/types/medicine';
import { MedicineTable } from '@/components/medicines/data-table';
import { NewMedicine } from '@/components/medicines/add-new';
import { lusitana } from '@/components/fonts';
import { Button } from '@/components/button';
import { COLOR_PALETTE2 } from '@/components/variables';
import { RefreshCcwIcon } from 'lucide-react';

export default function Page() {
  const supabase = createClient();
  const [medecine, setMedecines] = useState<Medicines[]>([]);
  const [onRefresh, setResfresh] = useState<boolean>(false);

  const refresh = () => {
    setResfresh((prev) => !prev);
  };

  const fetchMedicines = useCallback(async () => {
    const { data: todos, error } = await supabase
      .from('medicines')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.log('MedError', error);
    } else {
      setMedecines(todos);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines, onRefresh]);

  // const deleteTodo = async (id: number) => {
  //   try {
  //     await supabase.from('todos').delete().eq('id', id).throwOnError();
  //     setTodos(todos.filter((x) => x.id != id));
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  return (
    <main className="flex h-full w-full flex-col">
      <h1
        className={`${lusitana.className} mb-4 text-xl font-[800] md:text-3xl`}
      >
        Medicines
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-4 md:flex-row md:gap-20">
        <div>
          <h2 className=" mb-4 text-xl font-bold text-gray-800">
            All Medicines
          </h2>
          <MedicineTable data={medecine} />
        </div>
        <div>
          <h2 className=" mb-4 text-xl font-bold text-gray-800">
            Add New Medicine
          </h2>
          <NewMedicine />
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
