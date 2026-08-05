"use client";

import { useSession } from "next-auth/react";
import { User, Mail, ShieldCheck, CalendarDays } from "lucide-react";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const user = session?.user || {};

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Admin Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your admin identity, email, and role visibility for the
          marketplace.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Admin avatar"}
                className="h-28 w-28 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-amber-500 text-white text-3xl font-black">
                {user.name?.charAt(0) || "A"}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {user.name || "Admin User"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {user.email || "admin@example.com"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge icon={ShieldCheck} label={user.role || "admin"} />
              <Badge
                icon={Mail}
                label={user.email ? "Verified Email" : "No Email"}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard
            icon={ShieldCheck}
            title="Role"
            description="Administrative access with full management privileges."
            value={user.role || "admin"}
          />
          <InfoCard
            icon={Mail}
            title="Email"
            description="Primary login email for this admin account."
            value={user.email || "Not available"}
          />
          <InfoCard
            icon={CalendarDays}
            title="Member Since"
            description="The account creation time is recorded in the database."
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Stored in DB"
            }
          />
          <InfoCard
            icon={User}
            title="Account Type"
            description="Admin users can manage furniture, roles, and featured content."
            value="Administrator"
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description, value }) {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-500">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-xs uppercase font-semibold tracking-wide text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function Badge({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100/80 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
      <Icon size={16} className="text-amber-500" />
      {label}
    </div>
  );
}
