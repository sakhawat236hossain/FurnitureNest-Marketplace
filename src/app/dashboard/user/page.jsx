"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ShoppingBag, Heart, Package, DollarSign } from "lucide-react";

export default function UserDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, spent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        const [ordersRes, wishlistRes] = await Promise.all([
          axios.get(`/api/user/orders?email=${email}`),
          axios.get(`/api/user/wishlist?email=${email}`),
        ]);

        const orders = ordersRes.data?.orders || [];
        const wishlist = wishlistRes.data?.items || [];
        const spent = orders.reduce(
          (sum, order) => sum + Number(order.totalPrice || 0),
          0,
        );

        setStats({
          orders: orders.length,
          wishlist: wishlist.length,
          spent,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const statItems = [
    {
      title: "Total Orders",
      value: loading ? "—" : stats.orders,
      icon: ShoppingBag,
    },
    {
      title: "Wishlist Items",
      value: loading ? "—" : stats.wishlist,
      icon: Heart,
    },
    { title: "Products Viewed", value: "34", icon: Package },
    {
      title: "Total Spent",
      value: loading ? "—" : `৳${stats.spent.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-linear-to-r from-amber-400 to-orange-500 p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold">
          Welcome back, {session?.user?.name || "User"} 👋
        </h2>
        <p className="mt-2 text-white/90">
          Manage your furniture orders, wishlist and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statItems.map((item) => {
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
    </div>
  );
}
