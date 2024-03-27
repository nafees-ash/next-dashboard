import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SimpleCardProps } from '@/lib/types/supabase';
import { MouseEvent, useState } from 'react';
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
import { error } from 'console';

export function SimpleCard({
  simpleCardData,
  supabase,
}: {
  simpleCardData: SimpleCardProps;
  supabase: SupabaseClient<any, 'public', any>;
}) {
  const { toast } = useToast();
  const { id, title, items, status } = simpleCardData;

  const [statusValue, setStatusValue] = useState(status);

  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    const response = await supabase
      .from('orders')
      .update({ status: statusValue })
      .eq('id', id);
    if (!response.error) {
      toast({
        description: 'Status Changed',
      });
    } else {
      toast({
        description: response.error.message,
      });
    }
  };

  return (
    <Card className="bg-grey-50 w-[350px] pt-5">
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
                Ordered Items
              </Label>
              {items.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
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
            disabled={statusValue === status ? true : false}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
