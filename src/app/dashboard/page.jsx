'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // NextAuth loading হলে wait করো
    if (status === 'loading') return;

    // Google login user
    if (session?.user) {
      const role = session.user.role || 'user';

      if (role === 'admin') {
        router.replace('/admin');
      } else if (role === 'seller') {
        router.replace('/seller');
      } else {
        router.replace('/dashboard/user');
      }
      return;
    }

    // Credentials login user (localStorage)
    const storedUser =
      typeof window !== 'undefined'
        ? localStorage.getItem('user')
        : null;

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'seller') {
        router.replace('/seller');
      } else {
        router.replace('/dashboard/user');
      }
    } else {
      router.replace('/login');
    }
  }, [session, status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium">Loading dashboard...</p>
    </div>
  );
}