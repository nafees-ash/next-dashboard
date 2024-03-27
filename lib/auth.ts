import { createClient } from '@/lib/supabase/server';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export const isAuthenticated = async (): Promise<boolean> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const supabase = await createClient();
      const session = (await supabase.auth.getSession()).data.session;

      if (session) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching session:', error);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  console.error('Max retries reached, unable to fetch session.');
  return false;
};

export const sessionUser = async (): Promise<string | null> => {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user?.id;
  if (user) {
    return user;
  }
  return null;
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    const supabase = await createClient();
    const userId = await sessionUser();

    if (!userId) {
      return false;
    }

    const { data, error } = await supabase
      .from('admin')
      .select('id')
      .eq('uid', userId)
      .single();

    if (error) {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
