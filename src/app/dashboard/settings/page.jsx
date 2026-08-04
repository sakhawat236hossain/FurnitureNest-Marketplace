"use client";

export default function SettingsPage() {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Account Settings
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Password changes and preferences will be wired into this panel soon.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-600 dark:text-gray-300">
        This section is ready for future account security and preference
        controls.
      </div>
    </div>
  );
}
