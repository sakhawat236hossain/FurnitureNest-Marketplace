"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Mail, Phone, Shield, Calendar, Star, TrendingUp } from "lucide-react";
import TrendChart from "@/components/ui/TrendChart";

export default function SellerProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      let email = session?.user?.email;

      if (!email && typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) email = JSON.parse(stored).email;
      }

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/profile?email=${email}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <p className="text-gray-500">No seller profile found.</p>;

  const chartData = [
    { label: "Jan", value: 26 },
    { label: "Feb", value: 32 },
    { label: "Mar", value: 39 },
    { label: "Apr", value: 47 },
    { label: "May", value: 54 },
    { label: "Jun", value: 62 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-100/80">
              Seller Profile
            </p>
            <h1 className="mt-3 text-3xl font-black">{user.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90">
              Premium seller overview showing profile details, marketplace
              performance, and order momentum.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase text-amber-100/75">Verified</p>
              <p className="mt-2 text-2xl font-black">
                {user.email ? "Yes" : "No"}
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase text-amber-100/75">
                Seller Since
              </p>
              <p className="mt-2 text-2xl font-black">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_0.55fr]">
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                className="h-28 w-28 rounded-3xl object-cover border-4 border-amber-400/20"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                  <Star size={16} className="text-amber-500" />
                  {user.role || "Seller"}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Listings
                </p>
                <p className="mt-3 text-3xl font-black text-gray-900 dark:text-white">
                  27
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Orders
                </p>
                <p className="mt-3 text-3xl font-black text-gray-900 dark:text-white">
                  14
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <InfoCard icon={Mail} label="Email" value={user.email} />
            <InfoCard
              icon={Phone}
              label="Phone"
              value={user.phone || "Not provided"}
            />
            <InfoCard
              icon={Shield}
              label="Role"
              value={user.role || "Seller"}
            />
            <InfoCard
              icon={Calendar}
              label="Joined"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />
          </div>
        </div>

        <TrendChart
          title="Monthly Order Momentum"
          subtitle="A premium overview of recent seller activity"
          data={chartData}
        />
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-500">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-xs uppercase font-semibold tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
