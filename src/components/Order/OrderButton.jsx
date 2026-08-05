"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function OrderButton({ product }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const userEmail = useMemo(() => {
    if (session?.user?.email) return session.user.email;
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("user");
    if (!stored) return "";
    try {
      const parsed = JSON.parse(stored);
      return parsed?.email || "";
    } catch {
      return "";
    }
  }, [session]);

  const handleOrderNow = async () => {
    if (!userEmail) {
      toast.error("Please login to place an order.");
      return;
    }

    // Collect minimal buyer details (prefill from session if available)
    const name = session?.user?.name || window.prompt("Your full name:", "");
    if (!name) return toast.error("Name is required to place an order.");
    const phone = window.prompt("Phone number:", "") || "";
    const address = window.prompt("Shipping address:", "") || "";

    setLoading(true);
    try {
      const item = {
        id: product._id?.toString(),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || "/placeholder.png",
        category: product.category,
        vendorName: product.vendorName,
        vendorEmail: product.vendorEmail,
      };

      const res = await axios.post("/api/user/orders", {
        userEmail,
        userName: name,
        userPhone: phone,
        shippingAddress: address,
        items: [item],
        totalPrice: Number(product.price) || 0,
        paymentMethod: "Cash on Delivery",
      });

      if (res.data.success) {
        toast.success("Order request submitted. Admin will review it.");
      } else {
        toast.error(res.data.message || "Unable to place order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleOrderNow}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
    >
      {loading ? "Ordering..." : "Order Now"}
    </button>
  );
}
