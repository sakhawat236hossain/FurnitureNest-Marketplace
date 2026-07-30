'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Package,
  Users,
  BarChart3,
  ClipboardList,
  PlusSquare,
} from 'lucide-react';

const userMenu = [
  { name: 'Dashboard', href: '/dashboard/user', icon: LayoutDashboard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const sellerMenu = [
  { name: 'Seller Dashboard', href: '/seller', icon: LayoutDashboard },
  { name: 'Vendor Profile', href: '/seller/profile', icon: User },
  { name: 'Add Furniture', href: '/seller/add-furniture', icon: PlusSquare },
  { name: 'My Furniture', href: '/seller/my-furniture', icon: Package },
  { name: 'Requested Orders', href: '/seller/orders', icon: ClipboardList },
  { name: 'Sales Overview', href: '/seller/sales', icon: BarChart3 },
];

const adminMenu = [
  { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'All Furniture', href: '/admin/furniture', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState('user');

  useEffect(() => {
    setMounted(true);

    // NextAuth user
    if (session?.user?.role) {
      setRole(session.user.role);
      return;
    }

    // localStorage fallback
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setRole(JSON.parse(storedUser).role || 'user');
    }
  }, [session]);

  // Hydration mismatch avoid
  if (!mounted) {
    return (
      <aside className="w-72 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 min-h-screen">
        <div className="h-8 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-8" />
      </aside>
    );
  }

  let menu = userMenu;

  if (role === 'seller') {
    menu = sellerMenu;
  } else if (role === 'admin') {
    menu = adminMenu;
  }

  return (
    <aside className="w-72 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 min-h-screen">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
        {role === 'admin'
          ? 'Admin Panel'
          : role === 'seller'
          ? 'Seller Panel'
          : 'User Panel'}
      </h2>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem('user');
          signOut({ callbackUrl: '/' });
        }}
        className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}