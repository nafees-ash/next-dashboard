import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BoxInfoProps, SimpleCardProps } from '@/lib/types/supabase';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { COLOR_PALETTE2 } from '../variables';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '../ui/use-toast';

export function SimpleCard({
  simpleCardData,
  supabase,
}: {
  simpleCardData: SimpleCardProps;
  supabase: SupabaseClient<any, 'public', any>;
}) {
  const { toast } = useToast();
  const [cardData, setCartData] = useState(simpleCardData);
  const {
    id,
    userId,
    title,
    medicine_id,
    medicine_name,
    status,
    order_box,
    hasReminder,
    reminder,
    count,
  } = cardData;

  const [statusValue, setStatusValue] = useState(status);
  const [boxInfo, setBoxInfo] = useState<BoxInfoProps | null>();
  const [alreadyReminder, setAlredyReminder] = useState<boolean | null>();

  const fetchBoxInfo = useCallback(async () => {
    const { data: boxData, error } = await supabase
      .from('boxs')
      .select('*')
      .eq('owned_by', userId)
      .eq('medicine_id', medicine_id);
    if (!error) {
      setBoxInfo(boxData[0]);
    }

    const { data: reminderData, error: reminderError } = await supabase
      .from('owned')
      .select('*')
      .eq('owned_by', userId)
      .eq('medicine_id', medicine_id);
    if (!reminderError) {
      setAlredyReminder(!!reminderData[0]);
    }
  }, [medicine_id, supabase, userId]);

  console.log(boxInfo);
  console.log(alreadyReminder);

  const handleOrderDone = async () => {
    fetchBoxInfo();
    if (boxInfo && count) {
      console.log('here');
      const newCount = boxInfo.count + count;
      const { error } = await supabase
        .from('boxs')
        .update({ count: newCount })
        .eq('medicine_id', medicine_id)
        .eq('owned_by', userId);
      if (error) {
        console.log('Count', error);
      }
    } else {
      if (order_box) {
        console.log('here 2');
        const { error } = await supabase.from('boxs').insert({
          owned_by: userId,
          medicine_id,
          medicine_name,
          count: count,
        });
        if (error) {
          console.log('insert BOx', error);
        }
      }
      if (!alreadyReminder) {
        console.log('here 3');
        let newReminder: string[] | null = null;
        console.log(reminder);
        if (reminder) {
          const arrayFromString = JSON.parse(reminder.replace(/'/g, '"'));
          newReminder = arrayFromString.map(String);
        }

        const { error } = await supabase.from('owned').insert({
          owned_by: userId,
          medicine_id,
          medicine_name,
          hasReminder,
          reminder: newReminder,
        });
        if (error) {
          console.log('insert Owned', error);
        }
      }
    }

    const response = await supabase
      .from('orders')
      .update({ status: statusValue })
      .eq('id', id);
    if (!response.error) {
      setCartData({ ...cardData, status: statusValue });
      toast({
        description: 'Status Changed',
      });
    } else {
      toast({
        description: response.error.message,
      });
    }
  };

  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    if (statusValue !== 'done') {
      const response = await supabase
        .from('orders')
        .update({ status: statusValue })
        .eq('id', id);
      if (!response.error) {
        setCartData({ ...cardData, status: statusValue });
        toast({
          description: 'Status Changed',
        });
      } else {
        toast({
          description: response.error.message,
        });
      }
    } else {
      handleOrderDone();
    }
  };

  useEffect(() => {
    fetchBoxInfo();
  }, [fetchBoxInfo]);

  useEffect(() => {
    setCartData(simpleCardData);
    setStatusValue(simpleCardData.status);
  }, [simpleCardData]);

  return (
    <Card className="bg-grey-50 h-full w-full overflow-auto pt-5">
      <CardContent>
        <h2 className=" text-lefst border-b pb-2 text-lg font-bold">
          Items Details
        </h2>

        <form className="pt-[1rem]">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label className=" mb text-sm font-bold text-gray-500 underline">
                Order Id
              </Label>
              <p className="text-sm">{id}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label className=" mb text-sm font-bold text-gray-500 underline">
                Ordered By
              </Label>
              <p className="text-sm">{title}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label className=" mb text-sm font-bold text-gray-500 underline">
                Ordered Item
              </Label>
              <p>{medicine_name}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label className=" mb text-sm font-bold text-gray-500 underline">
                Status
              </Label>
              <Select
                onValueChange={(value: 'pending' | 'delivering' | 'done') =>
                  setStatusValue(value)
                }
                value={statusValue}
                required
              >
                <SelectTrigger
                  id="type"
                  name="type"
                  className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
                >
                  <SelectValue
                    placeholder="Select"
                    className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivering">Delivering</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="col-span-2 mt-3 rounded-lg border-[1px] p-3 text-black hover:bg-blue-200"
            style={{
              backgroundColor: COLOR_PALETTE2.lightblue,
              borderColor: COLOR_PALETTE2.darkblue,
            }}
            onClick={(e) => handleSubmit(e)}
            disabled={status === 'done' || statusValue === status}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
