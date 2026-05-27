import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Appel de votre fonction SQL has_role()
  const { data: isAdmin } = await supabase
    .rpc('has_role', { p_role: 'admin' });

  if (!user || !isAdmin) {
    redirect('/login'); // Rediriger si non admin
  }

  return <>{children}</>;
}
