'use client';

import { BarChart3, DollarSign, TrendingUp, Package } from 'lucide-react';

export default function SellerSalesPage() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="text-amber-500" size={32} />
          Sales & Earnings Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track sales performance, earnings breakdown, and top-performing products.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <DollarSign size={24} />
            <h3 className="font-bold text-gray-900 dark:text-white">Net Earnings</h3>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">৳45,000</p>
          <p className="text-xs text-gray-500 mt-1">Total revenue generated</p>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <TrendingUp size={24} />
            <h3 className="font-bold text-gray-900 dark:text-white">Conversion Rate</h3>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">18.4%</p>
          <p className="text-xs text-gray-500 mt-1">Views to order completion ratio</p>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-blue-500 mb-2">
            <Package size={24} />
            <h3 className="font-bold text-gray-900 dark:text-white">Units Sold</h3>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">14</p>
          <p className="text-xs text-gray-500 mt-1">Total furniture pieces delivered</p>
        </div>
      </div>
    </div>
  );
}
