'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/app/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/login-error');
  }

  const user = await supabase.auth.getUser();
  const session = await supabase.auth.getSession();

  const response = await supabase
    .from('admin')
    .select('*')
    .eq('uid', user?.data?.user?.id);
  // console.log(response);

  if (typeof response != 'undefined') {
    if (response.data && response.data.length < 1) {
      if (session) {
        await supabase.auth.signOut();
      }
      redirect('/');
    }
  } else {
    redirect('/user-error');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
