"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function AddToWishlistButton({ product }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const userEmail = useMemo(() => {
    if (session?.user?.email) {
      return session.user.email;
    }

    if (typeof window === "undefined") {
      return "";
    }

    const stored = localStorage.getItem("user");
    if (!stored) {
      return "";
    }

    try {
      const parsed = JSON.parse(stored);
      return parsed?.email || "";
    } catch {
      return "";
    }
  }, [session]);

  const handleAddToWishlist = async () => {
    if (!userEmail) {
      toast.error("Please login to add items to wishlist.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/user/wishlist", {
        userEmail,
        furnitureItem: {
          _id: product._id?.toString(),
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || "/placeholder.png",
          category: product.category,
          vendorName: product.vendorName,
          vendorEmail: product.vendorEmail,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Added to wishlist.");
      } else {
        toast.error(res.data.message || "Unable to add to wishlist.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to add to wishlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToWishlist}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-amber-400 hover:text-amber-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-950 dark:text-white"
    >
      {loading ? "Saving..." : "Wishlist"}
    </button>
  );
}
