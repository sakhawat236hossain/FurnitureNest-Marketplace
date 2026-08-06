'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SellerSidebar from '@/components/Seller/SellerSidebar';

export default function SellerLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    let role = session?.user?.role;

    if (!role) {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        role = JSON.parse(storedUser).role;
      }
    }

    if (role === 'seller') {
      setChecking(false);
    } else {
      router.push('/login');
    }
  }, [session, status, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-gray-50 dark:bg-slate-950">
      <SellerSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
