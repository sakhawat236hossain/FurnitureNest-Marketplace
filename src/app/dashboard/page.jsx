'use client';

import { useSession } from 'next-auth/react';
import {
  ShoppingBag,
  Heart,
  Package,
  DollarSign,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Orders',
    value: '12',
    icon: ShoppingBag,
  },
  {
    title: 'Wishlist Items',
    value: '8',
    icon: Heart,
  },
  {
    title: 'Products Viewed',
    value: '34',
    icon: Package,
  },
  {
    title: 'Total Spent',
    value: '$1,250',
    icon: DollarSign,
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold">
          Welcome back, {session?.user?.name || 'User'} 👋
        </h2>

        <p className="mt-2 text-white/90">
          Manage your furniture orders, wishlist and account settings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-300">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/5 p-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Luxury Velvet Sofa ordered
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                July 29, 2026
              </p>
            </div>

            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Confirmed
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/5 p-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Scandinavian Chair added to wishlist
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                July 28, 2026
              </p>
            </div>

            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Wishlist
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}