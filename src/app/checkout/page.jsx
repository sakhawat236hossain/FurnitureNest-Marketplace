"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    phone: "",
    district: "",
    address: "",
  });

  // Keep form in sync when session loads
  React.useEffect(() => {
    if (session?.user?.name && !form.name) {
      setForm((prev) => ({ ...prev, name: session.user.name }));
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please login to place an order.");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!form.name.trim() || !form.phone.trim() || !form.district.trim() || !form.address.trim()) {
      toast.error("Please fill in all delivery details.");
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        vendorName: item.vendorName,
        vendorEmail: item.vendorEmail,
        quantity: item.quantity,
      }));

      const res = await axios.post("/api/user/orders", {
        userName: form.name.trim(),
        userPhone: form.phone.trim(),
        district: form.district.trim(),
        shippingAddress: form.address.trim(),
        items,
        paymentMethod: "Cash on Delivery",
      });

      if (res.data.success) {
        toast.success("Order placed successfully via Cash on Delivery!");
        clearCart();
        router.push("/dashboard/orders");
      } else {
        toast.error(res.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl text-center dark:bg-slate-900 border border-gray-200 dark:border-white/10">
          <ShoppingBag className="mx-auto text-amber-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Login Required</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please sign in to your account to complete your Cash on Delivery checkout.
          </p>
          <Link
            href="/login?callbackUrl=/checkout"
            className="mt-6 inline-flex items-center justify-center w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20"
          >
            Sign In to Continue
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl text-center dark:bg-slate-900 border border-gray-200 dark:border-white/10">
          <ShoppingBag className="mx-auto text-amber-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
          >
            <ArrowLeft size={16} /> Explore Furniture
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-amber-500 transition mb-4">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Cash on Delivery Checkout
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete your delivery details to confirm your order. Pay cash upon doorstep delivery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Left Column: Delivery Details */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="text-amber-500" size={22} />
                Shipping & Delivery Address
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mobile Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01700000000"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    District / Region *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="e.g. Dhaka, Chittagong, Sylhet"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Full Street Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House number, Road name, Area / Neighborhood"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-500 p-2 text-white mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Payment Method: Cash on Delivery (COD)
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Pay in cash directly to our delivery representative upon inspecting your furniture items at home.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-white/10">
                Order Summary
              </h2>

              <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-80 overflow-y-auto my-4">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover border border-gray-200 dark:border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-white/10">
                  <span>Total Amount</span>
                  <span className="text-amber-500">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition disabled:opacity-60"
              >
                {loading ? "Placing Order..." : "Confirm Order (Cash on Delivery)"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>100% Secured Cash on Delivery</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
