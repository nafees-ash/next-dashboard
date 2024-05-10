import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { COLOR_PALETTE2 } from '../variables';
import { SupabaseClient } from '@supabase/supabase-js';
import { Appointment, EditMedecineProp } from '@/lib/types/supabase';

export function EditAppointment({
  supabase,
  apointpDetails,
  onComp,
}: {
  supabase: SupabaseClient;
  apointpDetails: Appointment;
  onComp: () => void;
}) {
  const { toast } = useToast();
  const [buttonEnable, setButtonEnable] = useState(false);
  const [formData, setFormData] = useState<Appointment>({
    id: apointpDetails.id,
    booked_by: apointpDetails.booked_by,
    doctor: apointpDetails.doctor,
    doctor_name: apointpDetails.doctor_name,
    done: apointpDetails.done,
  });

  const handleSubmit = async () => {
    const { data: _, error } = await supabase
      .from('appointments')
      .update(formData)
      .eq('id', formData.id);

    if (error) {
      toast({
        description: error.message,
      });
      return;
    }
    onComp();
    toast({
      description: 'Appointment Added.',
    });
  };

  function handleChange(event: { target: { name: any; value: any } }): void {
    setButtonEnable(true);
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  function handleSelectChange(value: any): void {
    setButtonEnable(true);
    console.log(value);
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        done: value === 'true',
      };
    });
  }

  useEffect(() => {
    setFormData({
      id: apointpDetails.id,
      booked_by: apointpDetails.booked_by,
      doctor: apointpDetails.doctor,
      doctor_name: apointpDetails.doctor_name,
      done: apointpDetails.done,
    });
  }, [apointpDetails]);

  return (
    <Card className="bg-grey-50 w-full pt-5">
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Serial No.</Label>
              <Input
                id="id"
                name="id"
                type="text"
                placeholder="Serial No."
                disabled
                value={formData.id}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="done">Status</Label>
              <Select
                onValueChange={(value: 'false' | 'true') =>
                  handleSelectChange(value)
                }
                value={formData.done.toString()}
                required
              >
                <SelectTrigger
                  id="done"
                  name="done"
                  className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
                >
                  <SelectValue
                    placeholder="Select"
                    className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="false">Pending</SelectItem>
                  <SelectItem value="true">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="col-span-2 rounded-lg border-[1px] p-3 text-black hover:bg-blue-200"
          style={{
            backgroundColor: COLOR_PALETTE2.lightblue,
            borderColor: COLOR_PALETTE2.darkblue,
          }}
          onClick={handleSubmit}
          disabled={buttonEnable ? false : true}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
