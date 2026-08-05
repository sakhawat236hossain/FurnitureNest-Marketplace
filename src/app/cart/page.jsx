"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });

  useEffect(() => {
    const fetchCart = async () => {
      let email = session?.user?.email;

      if (!email && typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) {
          email = JSON.parse(stored).email;
        }
      }

      if (!email) {
        setLoading(false);
        return;
      }

      setForm((prev) => ({
        ...prev,
        email,
        name: session?.user?.name || prev.name,
      }));

      try {
        const res = await axios.get(
          `/api/user/cart?email=${encodeURIComponent(email)}`,
        );
        setItems(res.data.items || []);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [session]);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`/api/user/cart?id=${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Unable to remove item");
    }
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      const totalPrice = items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
        0,
      );

      const res = await axios.post("/api/user/orders", {
        userEmail: form.email,
        userName: form.name,
        userPhone: form.phone,
        shippingAddress: form.address,
        items,
        totalPrice,
        paymentMethod: form.paymentMethod,
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Unable to place order.");
        return;
      }

      await Promise.all(
        items.map((item) => axios.delete(`/api/user/cart?id=${item._id}`)),
      );

      setItems([]);
      toast.success("Order placed successfully.");
      router.push("/dashboard/orders");
    } catch (error) {
      console.error(error);
      toast.error("Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-10 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
            Your Cart
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Shopping Cart
          </h1>
          <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-300">
            Review the items you have added and remove any you no longer need.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {loading ? (
            <div className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-12 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/80">
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-12 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/80">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Your cart is empty.
              </p>
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Add a product from the marketplace to start shopping.
              </p>
              <Link
                href="/categories"
                className="mt-6 inline-flex rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02]"
              >
                Browse furniture
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-24 w-24 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-950">
                            <img
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Quantity: {item.quantity || 1}
                            </p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              ৳
                              {(
                                (Number(item.price) || 0) * (item.quantity || 1)
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
                    Order summary
                  </p>
                  <div className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ৳{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="mt-8 space-y-4">
                    <div className="grid gap-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full name
                        <input
                          value={form.name}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300 dark:focus:ring-amber-500/20"
                          placeholder="Your name"
                        />
                      </label>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              email: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300 dark:focus:ring-amber-500/20"
                          placeholder="you@example.com"
                        />
                      </label>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone number
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              phone: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300 dark:focus:ring-amber-500/20"
                          placeholder="01XXXXXXXXX"
                        />
                      </label>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Shipping address
                        <textarea
                          value={form.address}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              address: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300 dark:focus:ring-amber-500/20"
                          placeholder="Street address, city, postal code"
                          rows={4}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={placingOrder}
                      className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {placingOrder ? "Placing order..." : "Place order"}
                    </button>
                  </form>
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
