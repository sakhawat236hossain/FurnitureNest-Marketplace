"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Star,
  Package,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminFeaturedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApprovedItems();
  }, []);

  const fetchApprovedItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/furniture?status=approved");
      if (res.data.success) {
        setItems(res.data.furniture);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load featured items");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (item) => {
    try {
      setProcessingId(item._id);
      const res = await axios.patch("/api/admin/furniture", {
        furnitureId: item._id,
        featured: !item.featured,
      });
      if (res.data.success) {
        toast.success(
          item.featured ? "Item removed from featured" : "Item featured",
        );
        fetchApprovedItems();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update featured state",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const featuredCount = items.filter((item) => item.featured).length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Sparkles className="text-amber-500" size={32} />
              Featured Items
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose which approved products appear in the home page featured
              furniture section.
            </p>
          </div>
          <div className="rounded-3xl bg-amber-50 dark:bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200 shadow-sm">
            {featuredCount} featured item(s) selected — limit 6
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            Loading approved items...
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            No approved items available yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="pb-4">Product</th>
                <th className="pb-4">Vendor</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Featured</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400">
                        <Package size={18} />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.category || "General"}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600 dark:text-gray-300">
                    <p className="font-medium text-sm">
                      {item.vendorName || "Vendor"}
                    </p>
                    <p className="text-xs text-gray-400">{item.vendorEmail}</p>
                  </td>
                  <td className="py-4 font-bold text-gray-900 dark:text-white">
                    ৳{(item.price || 0).toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        item.featured
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      disabled={processingId === item._id}
                      onClick={() => handleToggleFeature(item)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-orange-500/30 transition disabled:opacity-60"
                    >
                      <Star size={14} />
                      {item.featured ? "Unfeature" : "Feature"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
