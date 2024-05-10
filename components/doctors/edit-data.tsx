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
import { Doctor, EditMedecineProp } from '@/lib/types/supabase';

export function EditDoctor({
  supabase,
  docDetails,
  onComp,
}: {
  supabase: SupabaseClient;
  docDetails: Doctor;
  onComp: () => void;
}) {
  const { toast } = useToast();
  const [buttonEnable, setButtonEnable] = useState(false);
  const [formData, setFormData] = useState<Doctor>({
    id: docDetails.id,
    name: docDetails.name,
    schedule: docDetails.schedule,
    available: docDetails.available,
    expertise: docDetails.expertise,
    hospital: docDetails.hospital,
    degree: docDetails.degree,
  });

  const handleSubmit = async () => {
    const { data: _, error } = await supabase
      .from('doctors')
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
      description: 'Doctor Added.',
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

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        available: value === 'true',
      };
    });
  }

  useEffect(() => {
    setFormData({
      id: docDetails.id,
      name: docDetails.name,
      schedule: docDetails.schedule,
      available: docDetails.available,
      expertise: docDetails.expertise,
      hospital: docDetails.hospital,
      degree: docDetails.degree,
    });
  }, [docDetails]);

  return (
    <Card className="bg-grey-50 w-full pt-5">
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Name of the Doctor"
                onChange={handleChange}
                value={formData.name}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Degree</Label>
              <Input
                id="expertise"
                name="expertise"
                type="text"
                placeholder="Expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="available">Available</Label>
              <Select
                onValueChange={(value: 'false' | 'true') =>
                  handleSelectChange(value)
                }
                value={formData.available.toString()}
                required
              >
                <SelectTrigger
                  id="available"
                  name="available"
                  className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
                >
                  <SelectValue
                    placeholder="Select"
                    className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
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
