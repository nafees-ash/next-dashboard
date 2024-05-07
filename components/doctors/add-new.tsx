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
import { createClient } from '@/lib/supabase/client';
import { COLOR_PALETTE2 } from '../variables';

interface DocInput {
  name: string;
  hospital: string;
  expertise: string;
  schedule: string;
  degree: string;
}

export function NewDoctor() {
  const { toast } = useToast();
  const supabase = createClient();
  const [formData, setFormData] = useState<DocInput>({
    name: '',
    hospital: '',
    expertise: '',
    schedule: '',
    degree: '',
  });

  const handleSubmit = async () => {
    const { data: _, error } = await supabase
      .from('doctors')
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
      description: 'Doctor added.',
    });
  };

  const clearform = () => {
    setFormData({
      name: '',
      hospital: '',
      expertise: '',
      schedule: '',
      degree: '',
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
                id="degree"
                name="degree"
                type="text"
                placeholder="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Hospital</Label>
              <Input
                id="hospital"
                name="hospital"
                type="text"
                placeholder="Hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Expertise</Label>
              <Input
                id="expertise"
                name="expertise"
                type="text"
                placeholder="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Schedule</Label>
              <Input
                id="schedule"
                name="schedule"
                type="text"
                placeholder="schedule"
                value={formData.schedule}
                onChange={handleChange}
                required
                className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
              />
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
          disabled={formData.name ? false : true}
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
