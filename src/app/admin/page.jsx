'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  UserCheck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard statistics');
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

  const stats = [
    {
      title: 'Total Users',
      value: data?.stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Active Sellers',
      value: data?.stats?.totalSellers || 0,
      icon: Store,
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Listed Furniture',
      value: data?.stats?.totalFurniture || 0,
      icon: Package,
      color: 'from-emerald-400 to-teal-600',
    },
    {
      title: 'Total Orders',
      value: data?.stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Total Revenue',
      value: `৳${(data?.stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
            <ShieldCheck size={16} /> Admin Control Center
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black">
            System Overview & Management
          </h1>
          <p className="mt-2 text-gray-300 max-w-2xl text-sm sm:text-base">
            Control user access roles, review vendor product listings, track platform sales and enforce marketplace permissions.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition"
            >
              Manage Users & Roles
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/admin/furniture"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition"
            >
              All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {stats.map((item) => {
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

      {/* Recent Users Table */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recently Registered Users
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Users who recently joined FurnishNest
            </p>
          </div>
          <Link
            href="/admin/users"
            className="text-sm font-semibold text-amber-500 hover:text-amber-600 transition"
          >
            View All Users →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {data?.recentUsers?.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                  <td className="py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    {u.image ? (
                      <img src={u.image} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    {u.name}
                  </td>
                  <td className="py-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                          : u.role === 'seller'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                      }`}
                    >
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href="/admin/users"
                      className="text-xs font-semibold text-amber-500 hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
