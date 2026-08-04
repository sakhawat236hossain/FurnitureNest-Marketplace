'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Package,
  CheckCircle,
  XCircle,
  Trash2,
  Tag,
  Store,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminFurniturePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchFurniture();
  }, [statusFilter]);

  const fetchFurniture = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/furniture?status=${statusFilter}`
      );
      if (res.data.success) {
        setItems(res.data.furniture);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch furniture listings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (furnitureId, newStatus) => {
    try {
      const res = await axios.patch('/api/admin/furniture', {
        furnitureId,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Product ${newStatus}`);
        setItems((prev) =>
          prev.map((item) =>
            item._id === furnitureId ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (furnitureId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await axios.delete(
        `/api/admin/furniture?furnitureId=${furnitureId}`
      );
      if (res.data.success) {
        toast.success('Furniture item deleted');
        setItems((prev) => prev.filter((item) => item._id !== furnitureId));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="text-amber-500" size={32} />
            Marketplace Furniture Moderation
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Moderate seller product listings, approve new submissions, or remove items.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {['all', 'approved', 'pending', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold capitalize transition ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Table */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            No furniture listings found for this status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="pb-4">Product Details</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Vendor</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    <td className="py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </p>
                        <span className="text-xs text-gray-400">
                          Stock: {item.stock || 1}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                        <Tag size={12} /> {item.category || 'General'}
                      </span>
                    </td>

                    <td className="py-4 text-gray-600 dark:text-gray-300">
                      <p className="font-medium text-xs text-gray-800 dark:text-gray-200 flex items-center gap-1">
                        <Store size={12} className="text-amber-500" />
                        {item.vendorName || 'Vendor'}
                      </p>
                      <p className="text-[11px] text-gray-400">{item.vendorEmail}</p>
                    </td>

                    <td className="py-4 font-bold text-gray-900 dark:text-white">
                      ৳{(item.price || 0).toLocaleString()}
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          item.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : item.status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {item.status || 'approved'}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(item._id, 'approved')}
                            className="flex items-center gap-1 rounded-xl bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600 transition"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {item.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(item._id, 'rejected')}
                            className="flex items-center gap-1 rounded-xl bg-amber-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-600 transition"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="rounded-xl p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
