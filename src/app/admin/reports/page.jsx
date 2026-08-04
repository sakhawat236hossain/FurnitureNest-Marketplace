"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const avgOrderValue = stats?.totalOrders
    ? (stats.totalRevenue || 0) / stats.totalOrders
    : 0;
  const vendorRetention = stats?.totalUsers
    ? Math.min(100, Math.round((stats.totalSellers / stats.totalUsers) * 100))
    : 0;
  const growthRate = stats?.totalUsers
    ? Math.min(
        100,
        Math.round(
          (stats.totalUsers / Math.max(1, stats.totalSellers || 1)) * 10,
        ),
      )
    : 0;

  const cards = [
    {
      title: "Growth Rate",
      value: loading ? "—" : `+${growthRate}%`,
      detail: "Derived from current user and seller counts",
      icon: TrendingUp,
      color: "text-amber-500",
    },
    {
      title: "Avg. Order Value",
      value: loading ? "—" : `৳${avgOrderValue.toLocaleString()}`,
      detail: "Average spent per transaction",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Vendor Retention",
      value: loading ? "—" : `${vendorRetention}%`,
      detail: "Sellers actively listed against total users",
      icon: Users,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="text-amber-500" size={32} />
          Platform Analytics & Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Live marketplace insights taken directly from the database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm"
            >
              <div className={`flex items-center gap-3 ${card.color} mb-2`}>
                <Icon size={24} />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
