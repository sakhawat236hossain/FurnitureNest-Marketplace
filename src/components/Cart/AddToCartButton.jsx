"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function AddToCartButton({ product }) {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
      return;
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setUserEmail(parsed.email);
        }
      }
    }
  }, [session]);

  const handleAddToCart = async () => {
    if (!userEmail) {
      toast.error("Please login to add items to cart.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/user/cart", {
        userEmail,
        furnitureItem: {
          id: product._id?.toString(),
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || "/placeholder.png",
          category: product.category,
          vendorName: product.vendorName,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Added to cart.");
      } else {
        toast.error(res.data.message || "Unable to add to cart.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
