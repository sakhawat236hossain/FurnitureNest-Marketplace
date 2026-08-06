"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import {
  Store,
  BadgeCheck,
  Search,
  Package,
  DollarSign,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'verified', 'pending', 'suspended'

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/sellers");
      if (res.data.success) {
        setSellers(res.data.sellers || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load seller directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleToggleVerification = async (seller) => {
    const updatedVerification = !seller.verified;
    try {
      const res = await axios.patch("/api/admin/sellers", {
        sellerId: seller._id,
        verified: updatedVerification,
      });

      if (res.data.success) {
        toast.success(
          updatedVerification
            ? `Verified vendor badge granted to ${seller.name}`
            : `Verified badge removed from ${seller.name}`
        );
        setSellers((prev) =>
          prev.map((s) =>
            s._id === seller._id ? { ...s, verified: updatedVerification } : s
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update seller verification state.");
    }
  };

  const handleToggleStatus = async (seller) => {
    const newStatus = seller.status === "suspended" ? "active" : "suspended";
    if (
      !confirm(
        `Are you sure you want to ${
          newStatus === "suspended" ? "SUSPEND" : "REACTIVATE"
        } vendor "${seller.name}"?`
      )
    ) {
      return;
    }

    try {
      const res = await axios.patch("/api/admin/sellers", {
        sellerId: seller._id,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(
          newStatus === "suspended"
            ? `Seller account for ${seller.name} suspended.`
            : `Seller account for ${seller.name} reactivated.`
        );
        setSellers((prev) =>
          prev.map((s) => (s._id === seller._id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update seller status.");
    }
  };

  // Filter sellers
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name?.toLowerCase().includes(search.toLowerCase()) ||
      seller.email?.toLowerCase().includes(search.toLowerCase()) ||
      seller.shopName?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "verified") return seller.verified;
    if (filter === "pending") return !seller.verified;
    if (filter === "suspended") return seller.status === "suspended";

    return true;
  });

  const totalSellers = sellers.length;
  const verifiedCount = sellers.filter((s) => s.verified).length;
  const pendingCount = sellers.filter((s) => !s.verified).length;
  const totalSellerSales = sellers.reduce(
    (acc, curr) => acc + (curr.totalRevenue || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-200/80 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-8 sm:p-10 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-4 py-1 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-400/20">
              <Building2 className="h-4 w-4" /> Marketplace Vendors
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Seller & Vendor Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Audit vendor store applications, grant official Verified Checkmark badges, inspect product inventory metrics, and manage seller suspensions.
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-amber-200/60 dark:border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Vendors</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalSellers}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified Stores</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{verifiedCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Unverified Audit</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Seller Gross Sales</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">৳{totalSellerSales.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor name, email or shop name..."
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Sellers" },
            { id: "verified", label: "Verified Only" },
            { id: "pending", label: "Unverified" },
            { id: "suspended", label: "Suspended" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                filter === tab.id
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 text-amber-500 font-semibold">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading seller records...
          </div>
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-12 text-center shadow-sm">
          <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            No seller accounts found.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {search || filter !== "all"
              ? "Try adjusting your search query or filter."
              : "When users register or get promoted to seller role, they will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredSellers.map((seller) => {
            const isSuspended = seller.status === "suspended";

            return (
              <div
                key={seller._id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-xl ${
                  isSuspended
                    ? "border-red-300 dark:border-red-500/30 bg-red-50/20"
                    : seller.verified
                    ? "border-emerald-200 dark:border-emerald-500/20"
                    : "border-gray-200/80 dark:border-white/10"
                }`}
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-black text-white shadow-md">
                        {seller.image ? (
                          <img
                            src={seller.image}
                            alt={seller.name}
                            className="h-full w-full rounded-2xl object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          seller.name?.[0]?.toUpperCase() || "V"
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                            {seller.shopName || seller.name}
                          </h3>
                          {seller.verified && (
                            <BadgeCheck
                              className="h-5 w-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0"
                              title="Verified Seller"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {seller.name}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        isSuspended
                          ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                          : seller.verified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                      }`}
                    >
                      {isSuspended ? "Suspended" : seller.verified ? "Verified" : "Pending Audit"}
                    </span>
                  </div>

                  {/* Email & Info */}
                  <div className="mt-4 space-y-1.5 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-white/5 pt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-amber-500" />
                      <span className="truncate">{seller.email}</span>
                    </div>

                    {seller.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        <span>
                          Joined: {new Date(seller.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metrics Bar */}
                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Listings</p>
                      <p className="text-base font-extrabold text-gray-900 dark:text-white">
                        {seller.totalProducts ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Approved</p>
                      <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {seller.approvedProducts ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Orders</p>
                      <p className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                        {seller.totalOrders ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between px-1 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Estimated Revenue:</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      ৳{(seller.totalRevenue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Toggle Verification Badge */}
                    <button
                      onClick={() => handleToggleVerification(seller)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                        seller.verified
                          ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                          : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{seller.verified ? "Remove Badge" : "Verify Vendor"}</span>
                    </button>

                    {/* Toggle Status (Suspend / Reactivate) */}
                    <button
                      onClick={() => handleToggleStatus(seller)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                        isSuspended
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 hover:bg-emerald-200"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-100"
                      }`}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{isSuspended ? "Reactivate" : "Suspend"}</span>
                    </button>
                  </div>

                  {/* Direct Link to Seller Furniture */}
                  <Link
                    href={`/admin/furniture`}
                    className="inline-flex items-center justify-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
                  >
                    <span>Manage Furniture Catalog</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
