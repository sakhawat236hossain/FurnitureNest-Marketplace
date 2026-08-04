'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { Package, PlusSquare, Trash2, Tag, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function MyFurniturePage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyFurniture();
  }, [session]);

  const fetchMyFurniture = async () => {
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
      const res = await axios.get(`/api/seller/furniture?email=${email}`);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load your furniture items');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (itemId, currentInStock) => {
    try {
      const res = await axios.patch('/api/seller/furniture', {
        itemId,
        inStock: !currentInStock,
      });

      if (res.data.success) {
        toast.success(
          !currentInStock ? 'Marked as In Stock' : 'Marked as Out of Stock'
        );
        setItems((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, inStock: !currentInStock } : item
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update stock status');
    }
  };

  const handleDelete = async (itemId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await axios.delete(`/api/seller/furniture?itemId=${itemId}`);
      if (res.data.success) {
        toast.success('Furniture item deleted');
        setItems((prev) => prev.filter((item) => item._id !== itemId));
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
            My Listed Furniture
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your furniture catalog, update availability, or delete items.
          </p>
        </div>

        <Link
          href="/seller/add-furniture"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:scale-105 transition"
        >
          <PlusSquare size={18} /> Add New Item
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            <p className="text-base font-semibold">No furniture items listed yet.</p>
            <Link
              href="/seller/add-furniture"
              className="mt-4 inline-block text-sm text-amber-500 font-bold hover:underline"
            >
              Add Your First Product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="pb-4">Product Details</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Stock Status</th>
                  <th className="pb-4 text-right">Actions</th>
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
                          Qty: {item.stock || 1}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                        <Tag size={12} /> {item.category || 'General'}
                      </span>
                    </td>

                    <td className="py-4 font-bold text-gray-900 dark:text-white">
                      ৳{(item.price || 0).toLocaleString()}
                    </td>

                    <td className="py-4">
                      <button
                        onClick={() => handleToggleStock(item._id, item.inStock ?? true)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                          item.inStock !== false
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                        }`}
                      >
                        {item.inStock !== false ? (
                          <>
                            <Check size={12} /> In Stock
                          </>
                        ) : (
                          <>
                            <X size={12} /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
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
