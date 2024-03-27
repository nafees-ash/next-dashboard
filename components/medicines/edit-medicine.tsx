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
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { COLOR_PALETTE2 } from '../variables';
import { SupabaseClient } from '@supabase/supabase-js';
import { EditMedecineProp } from '@/lib/types/supabase';

interface MedInput {
  title: string;
  price: number;
  type: 'tab' | 'cap' | 'syr' | 'gel' | 'drop';
}

export function EditMedicine({
  supabase,
  medDetails,
}: {
  supabase: SupabaseClient;
  medDetails: EditMedecineProp;
}) {
  const { toast } = useToast();
  const [buttonEnable, setButtonEnable] = useState(false);
  const [formData, setFormData] = useState<EditMedecineProp>({
    id: medDetails.id,
    title: medDetails.title,
    price: medDetails.price,
    type: medDetails.type,
  });

  const handleSubmit = async () => {
    const { data: _, error } = await supabase
      .from('medicines')
      .update(formData)
      .eq('id', formData.id);

    if (error) {
      toast({
        description: error.message,
      });
      return;
    }
    toast({
      description: 'Medicine Edited.',
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
  function handleSelectChange(
    value: 'tab' | 'cap' | 'syr' | 'gel' | 'drop',
  ): void {
    setButtonEnable(true);
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        type: value,
      };
    });
  }

  return (
    <Card className="bg-grey-50 w-[350px] pt-5">
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                name="title"
                placeholder="Name of the Medicine"
                onChange={handleChange}
                value={formData.title}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="How much per unit"
                value={formData.price}
                onChange={handleChange}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Type</Label>
              <Select
                onValueChange={(
                  value: 'tab' | 'cap' | 'syr' | 'gel' | 'drop',
                ) => handleSelectChange(value)}
                value={formData.type}
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
                  <SelectItem value="tab">Tablet</SelectItem>
                  <SelectItem value="syr">Syrup</SelectItem>
                  <SelectItem value="cap">Capsule</SelectItem>
                  <SelectItem value="gel">Gel</SelectItem>
                  <SelectItem value="drop">Drop</SelectItem>
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
