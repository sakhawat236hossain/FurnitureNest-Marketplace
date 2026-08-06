"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
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
        const res = await axios.get(`/api/user/orders?email=${email}`);
        setOrders(res.data?.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your recent purchases and current status.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-gray-200 dark:border-white/10 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                    order.status === "delivered"
                      ? "bg-emerald-100 text-emerald-700"
                      : order.status === "approved"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.status || "pending"}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 dark:bg-slate-950 dark:text-gray-300">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Name:
                  </span>{" "}
                  {order.userName || "N/A"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Email:
                  </span>{" "}
                  {order.userEmail || "N/A"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Phone:
                  </span>{" "}
                  {order.userPhone || "N/A"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    District:
                  </span>{" "}
                  {order.district || "N/A"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Address:
                  </span>{" "}
                  {order.shippingAddress || "N/A"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Payment:
                  </span>{" "}
                  {order.paymentMethod || "Cash on Delivery"}
                </p>
              </div>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <p>{order.items?.length || 0} item(s)</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  Total: ৳{(order.totalPrice || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
