import { useState } from 'react';
import { COLOR_PALETTE2 } from '../variables';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { createClient } from '@/app/lib/supabase/client';
import { Button } from '../ui/button';

export default function ChangePass() {
  const { toast } = useToast();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    password: '',
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    if (error) {
      toast({
        description: error.message,
      });
    } else {
      toast({
        description: 'password changed successfully',
      });
      setFormData({
        password: '',
      });

      toast({
        description: 'Password updated successfully!',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-[90%] items-center gap-x-10 gap-y-7 rounded-lg border-[1px] p-10 md:w-[70%] "
      style={{
        gridTemplateColumns: '30% 60%',
        borderColor: COLOR_PALETTE2.lightblue,
      }}
    >
      <label htmlFor="password">Password:</label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
      />
      <Button
        type="submit"
        className="col-span-2 rounded-lg border-[1px] p-3 text-black hover:bg-blue-200"
        style={{
          backgroundColor: COLOR_PALETTE2.lightblue,
          borderColor: COLOR_PALETTE2.darkblue,
        }}
      >
        Change Password
      </Button>
    </form>
  );
}
