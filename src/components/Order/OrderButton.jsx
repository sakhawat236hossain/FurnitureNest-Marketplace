"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  phone: "",
  district: "",
  address: "",
};

export default function OrderButton({ product }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  let storedUser = null;
  if (typeof window !== "undefined") {
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      storedUser = null;
    }
  }

  const userEmail = session?.user?.email || storedUser?.email || "";
  const userImage = session?.user?.image || storedUser?.image || "";

  const openOrderForm = () => {
    if (!userEmail) {
      toast.error("Please login to place an order.");
      return;
    }

    setForm({
      ...emptyForm,
      name: session?.user?.name || storedUser?.name || "",
      phone: storedUser?.phone || "",
    });
    setIsOpen(true);
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.district.trim() || !form.address.trim()) {
      toast.error("Please fill in all delivery details.");
      return;
    }

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
        userName: form.name.trim(),
        userImage,
        userPhone: form.phone.trim(),
        district: form.district.trim(),
        shippingAddress: form.address.trim(),
        items: [item],
        paymentMethod: "Cash on Delivery",
      });

      if (res.data.success) {
        toast.success("Order request sent to the vendor.");
        setIsOpen(false);
        setForm(emptyForm);
      } else {
        toast.error(res.data.message || "Unable to place order.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openOrderForm}
        className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        Order Now
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-form-title"
        >
          <form
            onSubmit={handleOrderSubmit}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="order-form-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                  Complete your order
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {product.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-xl px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-white/10"
                aria-label="Close order form"
              >
                ×
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm dark:bg-amber-500/10">
              <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
              <p className="mt-1 text-gray-600 dark:text-gray-300">৳{(Number(product.price) || 0).toLocaleString()}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
              <Field label="Mobile number" type="tel" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
              <div className="sm:col-span-2">
                <Field label="District" value={form.district} onChange={(value) => setForm((current) => ({ ...current, district: value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Full address
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                    placeholder="House, road, area"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsOpen(false)} disabled={loading} className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 disabled:opacity-50 dark:border-white/10 dark:text-gray-200">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60">
                {loading ? "Placing order..." : "Confirm order"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}
