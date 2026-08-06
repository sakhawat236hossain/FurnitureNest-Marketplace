"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";

export default function AddToWishlistButton({
  product,
  variant = "default",
  className = "",
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleAddToWishlist = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
        setIsSaved(true);
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

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAddToWishlist}
        disabled={loading}
        title="Add to Wishlist"
        aria-label="Add to Wishlist"
        className={`group/wishlist relative flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 p-2.5 text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-500 hover:scale-110 active:scale-95 disabled:opacity-70 ${
          isSaved ? "text-rose-500 bg-white dark:bg-slate-900" : ""
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        ) : (
          <Heart
            className={`h-4 w-4 transition-transform duration-200 group-hover/wishlist:scale-110 ${
              isSaved ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToWishlist}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/90 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 transition hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 shadow-sm disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
          <span>Wishlist</span>
        </>
      )}
    </button>
  );
}
