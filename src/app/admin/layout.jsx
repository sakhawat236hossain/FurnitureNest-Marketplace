'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    let role = session?.user?.role;

    // localStorage fallback
    if (!role) {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        role = JSON.parse(storedUser).role;
      }
    }

    if (role === 'admin') {
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

  return <div className="min-h-screen">{children}</div>;
}