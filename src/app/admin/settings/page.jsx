'use client';

import { Settings, Shield, Bell, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('System settings saved successfully');
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="text-amber-500" size={32} />
          System Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure marketplace platform parameters and security defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield size={20} className="text-amber-500" /> Platform Controls
          </h2>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Auto-Approve Vendor Furniture</p>
              <p className="text-xs text-gray-500">Allow verified sellers to list products without admin review</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-amber-500 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Vendor Sign-Up Moderation</p>
              <p className="text-xs text-gray-500">Require admin approval before users can switch to seller mode</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-amber-500 cursor-pointer" />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
