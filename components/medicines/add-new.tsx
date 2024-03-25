import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { createClient } from '@/app/lib/supabase/client';
import { COLOR_PALETTE2 } from '../variables';

interface MedInput {
  title: string;
  price: number;
  type: 'tab' | 'cap' | 'syr' | 'gel';
}

export function NewMedicine() {
  const { toast } = useToast();
  const supabase = createClient();
  const [formData, setFormData] = useState<MedInput>({
    title: '',
    price: 0,
    type: 'tab',
  });

  const handleSubmit = async () => {
    const { data: _, error } = await supabase
      .from('medicines')
      .insert(formData)
      .select()
      .single();

    if (error) {
      toast({
        description: error.message,
      });
      return;
    }
    clearform();
    toast({
      description: 'Medicine added.',
    });
  };

  const clearform = () => {
    setFormData({
      title: '',
      price: 0,
      type: 'tab',
    });
  };

  function handleChange(event: { target: { name: any; value: any } }): void {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  function handleSelectChange(value: 'tab' | 'cap' | 'syr' | 'gel'): void {
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
                onValueChange={(value: 'tab' | 'cap' | 'syr' | 'gel') =>
                  handleSelectChange(value)
                }
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
          onClick={clearform}
        >
          Clear
        </Button>
        <Button
          className="col-span-2 rounded-lg border-[1px] p-3 text-black hover:bg-blue-200"
          style={{
            backgroundColor: COLOR_PALETTE2.lightblue,
            borderColor: COLOR_PALETTE2.darkblue,
          }}
          onClick={handleSubmit}
          disabled={formData.title ? false : true}
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
