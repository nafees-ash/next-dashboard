import { signup } from '@/app/auth/actions';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { COLOR_PALETTE2 } from '../variables';
import { Input } from '../ui/input';
import { redirect } from 'next/navigation';

export default function AuthFormSignUp() {
  const supabase = createClient();
  const { toast } = useToast();

  const handleSignup = async (formData: FormData) => {
    const formdata = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const { data, error } = await supabase.auth.signUp(formdata);
    if (error) {
      toast({
        description: error.message,
      });
    } else {
      const response = await supabase.from('admin').insert({
        email: formdata.email,
        uid: data.user?.id,
        name: formdata.name,
      });
      if (!response.error) {
        toast({
          description: 'Admin created',
        });
        redirect('/');
      }
    }
  };

  return (
    <form
      className="grid min-w-[0px] gap-5 rounded-lg border-[1px] p-10"
      style={{
        gridTemplateColumns: '30% 60%',
        borderColor: COLOR_PALETTE2.lightblue,
      }}
    >
      <label htmlFor="email">Name:</label>
      <Input
        id="name"
        name="name"
        type="text"
        required
        className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
      />
      <label htmlFor="email">Email:</label>
      <Input
        id="email"
        name="email"
        type="email"
        required
        className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
      />
      <label htmlFor="password">Password:</label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
      />
      <Button
        formAction={handleSignup}
        className="col-span-2 rounded-lg border-[1px] p-3 text-black hover:bg-blue-200"
        style={{
          backgroundColor: COLOR_PALETTE2.lightblue,
          borderColor: COLOR_PALETTE2.darkblue,
        }}
      >
        Create Admin
      </Button>
    </form>
  );
}
