'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ShoppingCart, CheckCircle, Truck, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    let email = session?.user?.email;

    if (!email && typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) email = JSON.parse(stored).email;
    }

    if (!email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/seller/orders?email=${email}`);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch requested orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const handleStatusChange = async (orderId, newStatus) => {
    let email = session?.user?.email;
    if (!email && typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) email = JSON.parse(stored).email;
    }

    if (!email) {
      toast.error('Please login again to update this order.');
      return;
    }

    try {
      const res = await axios.patch('/api/seller/orders', {
        orderId,
        status: newStatus,
        vendorEmail: email,
      });

      if (res.data.success) {
        toast.success(`Order marked as ${newStatus.toUpperCase()}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <ShoppingCart className="text-amber-500" size={32} />
          Customer Requested Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and process orders placed by customers for your furniture items.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            No customer orders received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Shipping Address</th>
                  <th className="pb-4">Total Price</th>
                  <th className="pb-4">Fulfillment Status</th>
                  <th className="pb-4 text-right">Update Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    <td className="py-4 font-medium text-gray-900 dark:text-white">
                      <p className="font-bold">{order.userName || 'Customer'}</p>
                      <p className="text-xs text-gray-400">{order.userEmail}</p>
                    </td>

                    <td className="py-4 text-gray-600 dark:text-gray-300">
                      {order.shippingAddress || 'Dhaka, Bangladesh'}
                    </td>

                    <td className="py-4 font-extrabold text-gray-900 dark:text-white">
                      ৳{(order.totalPrice || 0).toLocaleString()}
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : order.status === 'approved'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      {order.status === 'pending' ? (
                        <button
                          onClick={() => handleStatusChange(order._id, 'approved')}
                          className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                        >
                          Approve Order
                        </button>
                      ) : order.status === 'approved' ? (
                        <button
                          onClick={() => handleStatusChange(order._id, 'delivered')}
                          className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
