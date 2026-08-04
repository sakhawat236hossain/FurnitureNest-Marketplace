'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Clock,
  DollarSign,
  PlusSquare,
  ArrowRight,
  Store,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SellerOverviewPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [session]);

  const fetchStats = async () => {
    let email = session?.user?.email;

    if (!email && typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) email = JSON.parse(stored).email;
    }

    if (!email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/seller/stats?email=${email}`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const statItems = [
    {
      title: 'My Furniture Items',
      value: stats?.totalFurniture || 0,
      icon: Package,
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Total Revenue',
      value: `৳${(stats?.totalEarnings || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-400 to-teal-600',
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur">
            <Store size={16} /> Vendor Management Console
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black">
            Welcome to Vendor Dashboard
          </h1>
          <p className="mt-2 text-white/90 max-w-xl text-sm sm:text-base">
            Add new furniture listings, manage product stock, track customer orders, and view sales performance.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/seller/add-furniture"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-md hover:bg-gray-100 transition"
            >
              <PlusSquare size={18} /> Add New Furniture
            </Link>
            <Link
              href="/seller/my-furniture"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition"
            >
              View Inventory <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {item.title}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
