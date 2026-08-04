"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BarChart3, DollarSign, TrendingUp, Package } from "lucide-react";
import { toast } from "sonner";

export default function SellerSalesPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
        const res = await axios.get(`/api/seller/stats?email=${email}`);
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load seller sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  const cards = [
    {
      title: "Net Earnings",
      value: loading ? "—" : `৳${(stats?.totalEarnings || 0).toLocaleString()}`,
      detail: "Total revenue generated",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Pending Orders",
      value: loading ? "—" : stats?.pendingOrders || 0,
      detail: "Orders awaiting fulfillment",
      icon: TrendingUp,
      color: "text-amber-500",
    },
    {
      title: "Units Listed",
      value: loading ? "—" : stats?.totalFurniture || 0,
      detail: "Furniture items currently listed",
      icon: Package,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="text-amber-500" size={32} />
          Sales & Earnings Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track sales performance, earnings breakdown, and current order
          activity from the database.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
