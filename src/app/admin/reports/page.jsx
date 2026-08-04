'use client';

import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="text-amber-500" size={32} />
          Platform Analytics & Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gain insight into user growth, top sales categories, and platform performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <TrendingUp size={24} />
            <h3 className="font-bold text-gray-900 dark:text-white">Growth Rate</h3>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">+24%</p>
          <p className="text-xs text-gray-500 mt-1">Monthly active marketplace buyers</p>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <DollarSign size={24} />
            <h3 className="font-bold text-gray-900 dark:text-white">Avg. Order Value</h3>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">৳18,500</p>
          <p className="text-xs text-gray-500 mt-1">Average spent per transaction</p>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-blue-500 mb-2">
            <Users size={24} />
            <h3 className="font-bold text-gray-900 dark:text-white">Vendor Retention</h3>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">96%</p>
          <p className="text-xs text-gray-500 mt-1">Sellers actively listing products</p>
        </div>
      </div>
    </div>
  );
}
