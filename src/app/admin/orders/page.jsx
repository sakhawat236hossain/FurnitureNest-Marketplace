'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.patch('/api/admin/orders', {
        orderId,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <ShoppingBag className="text-amber-500" size={32} />
          Global Order Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track customer purchases across all vendors and update fulfillment statuses.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            No orders found in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Items Count</th>
                  <th className="pb-4">Total Price</th>
                  <th className="pb-4">Order Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Update Fulfillment</th>
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
                      {order.items?.length || 1} item(s)
                    </td>

                    <td className="py-4 font-extrabold text-gray-900 dark:text-white">
                      ৳{(order.totalPrice || 0).toLocaleString()}
                    </td>

                    <td className="py-4 text-xs text-gray-500 dark:text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
