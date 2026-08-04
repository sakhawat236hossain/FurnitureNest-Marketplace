"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
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
        const res = await axios.get(`/api/user/wishlist?email=${email}`);
        setItems(res.data?.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [session]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/user/wishlist?id=${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Unable to remove item");
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <Heart size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Wishlist
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Saved furniture pieces you want to revisit later.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
          Your wishlist is empty right now.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-gray-200 dark:border-white/10 p-4"
            >
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                    🛋️
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ৳{(item.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
