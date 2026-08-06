"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Ticket,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Loader2,
  Percent,
  DollarSign,
  Calendar,
  Sparkles,
  Users,
  Check,
} from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minSpend: "",
    maxDiscount: "",
    usageLimit: "100",
    expiryDate: "",
    status: "active",
    description: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/coupons");
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minSpend: "",
      maxDiscount: "",
      usageLimit: "100",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "active",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || "",
      minSpend: coupon.minSpend || "",
      maxDiscount: coupon.maxDiscount || "",
      usageLimit: coupon.usageLimit || "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      status: coupon.status || "active",
      description: coupon.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("Coupon code is required.");
      return;
    }
    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      toast.error("Valid discount value is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingCoupon) {
        const res = await axios.put("/api/admin/coupons", {
          id: editingCoupon._id,
          ...formData,
        });
        if (res.data.success) {
          toast.success("Coupon updated successfully!");
          setIsModalOpen(false);
          fetchCoupons();
        }
      } else {
        const res = await axios.post("/api/admin/coupons", formData);
        if (res.data.success) {
          toast.success("Coupon created successfully!");
          setIsModalOpen(false);
          fetchCoupons();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      return;
    }

    try {
      const res = await axios.delete(`/api/admin/coupons?id=${id}`);
      if (res.data.success) {
        toast.success("Coupon deleted successfully.");
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete coupon.");
    }
  };

  const handleToggleStatus = async (coupon) => {
    const newStatus = coupon.status === "active" ? "inactive" : "active";
    try {
      const res = await axios.put("/api/admin/coupons", {
        id: coupon._id,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(
          newStatus === "active"
            ? `Coupon "${coupon.code}" activated.`
            : `Coupon "${coupon.code}" deactivated.`
        );
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCoupons = coupons.length;
  const activeCount = coupons.filter((c) => c.status === "active").map((c) => c).length;
  const totalRedemptions = coupons.reduce(
    (acc, curr) => acc + (curr.usedCount || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-200/80 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-8 sm:p-10 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-4 py-1 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-400/20">
              <Ticket className="h-4 w-4" /> Promotions & Discounts
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Coupons & Promo Codes
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Create discount codes, set percentage or fixed discounts, minimum spend thresholds, usage limits, and expiration dates.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 hover:from-amber-600 hover:to-orange-600"
          >
            <Plus className="h-5 w-5" />
            <span>Create Promo Code</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 border-t border-amber-200/60 dark:border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Promo Codes</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalCoupons}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Campaigns</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Redemptions</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalRedemptions} times</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promo code or description..."
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20"
          />
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-amber-500" />
                {editingCoupon ? "Edit Promo Code" : "Create New Promo Code"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Promo Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    })
                  }
                  placeholder="e.g. EID2026, WOOD15"
                  className="w-full uppercase font-mono tracking-wider font-bold rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: e.target.value })
                    }
                    placeholder={
                      formData.discountType === "percentage" ? "15" : "500"
                    }
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Min Spend & Max Discount Cap */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Min Spend (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minSpend}
                    onChange={(e) =>
                      setFormData({ ...formData, minSpend: e.target.value })
                    }
                    placeholder="e.g. 5000"
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Max Discount Cap (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDiscount: e.target.value })
                    }
                    placeholder="e.g. 2000"
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Usage Limit & Expiration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    placeholder="100"
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive / Paused</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Description / Campaign Note
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Notes for promotional campaign..."
                  className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 dark:border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingCoupon ? (
                    "Update Promo Code"
                  ) : (
                    "Create Promo Code"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 text-amber-500 font-semibold">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading promo codes...
          </div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-12 text-center shadow-sm">
          <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            No promo codes found.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Click "Create Promo Code" to add your first promotional discount.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCoupons.map((coupon) => {
            const isExpired =
              coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
            const isActive = coupon.status === "active" && !isExpired;

            const usagePercent = coupon.usageLimit
              ? Math.min(
                  100,
                  Math.round(((coupon.usedCount || 0) / coupon.usageLimit) * 100)
                )
              : 0;

            return (
              <div
                key={coupon._id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-xl ${
                  !isActive
                    ? "border-gray-200 dark:border-white/10 opacity-80"
                    : "border-amber-200/80 dark:border-amber-500/20"
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-sm font-black text-amber-600 dark:text-amber-400 font-mono tracking-wider">
                        <span>{coupon.code}</span>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          title="Copy Code"
                          className="hover:text-amber-700 dark:hover:text-amber-200 transition"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        isExpired
                          ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                          : coupon.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {isExpired
                        ? "Expired"
                        : coupon.status === "active"
                        ? "Active"
                        : "Paused"}
                    </span>
                  </div>

                  {/* Discount Value Highlight */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `৳${coupon.discountValue.toLocaleString()}`}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      OFF
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {coupon.description || "Promotional discount voucher."}
                  </p>

                  {/* Limits Info */}
                  <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-white/5 pt-3">
                    {coupon.minSpend > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Min Order Spend:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ৳{coupon.minSpend.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {coupon.maxDiscount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Max Discount Limit:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ৳{coupon.maxDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {coupon.expiryDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Expires On:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Usage Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
                      <span>Redemptions</span>
                      <span>
                        {coupon.usedCount || 0} / {coupon.usageLimit || "∞"}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(coupon)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                      coupon.status === "active"
                        ? "border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                        : "border-emerald-300 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                    }`}
                  >
                    {coupon.status === "active" ? "Pause Code" : "Activate Code"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(coupon)}
                      title="Edit Coupon"
                      className="flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:border-amber-400 hover:text-amber-500 transition"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(coupon._id, coupon.code)}
                      title="Delete Coupon"
                      className="flex items-center justify-center h-9 w-9 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
