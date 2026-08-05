"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-950">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Checkout is not implemented yet, but your cart items are
                        stored.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
