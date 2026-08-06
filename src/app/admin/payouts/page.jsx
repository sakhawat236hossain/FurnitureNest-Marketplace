"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Banknote,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  DollarSign,
  Calendar,
  CreditCard,
  Building2,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [stats, setStats] = useState({
    totalDisbursed: 0,
    totalPending: 0,
    totalCommissionEarned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedPayout, setSelectedPayout] = useState(null);
  const [txnInput, setTxnInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/payouts");
      if (res.data.success) {
        setPayouts(res.data.payouts || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payout records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!selectedPayout) return;

    setProcessing(true);
    try {
      const res = await axios.patch("/api/admin/payouts", {
        payoutId: selectedPayout._id,
        status: "approved",
        transactionId: txnInput || `TXN${Date.now()}`,
        notes: notesInput || selectedPayout.notes,
      });

      if (res.data.success) {
        toast.success(`Payout of ৳${selectedPayout.amount.toLocaleString()} approved!`);
        setSelectedPayout(null);
        setTxnInput("");
        setNotesInput("");
        fetchPayouts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to process payout.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (payout) => {
    const reason = prompt(
      `Please state reason for rejecting payout request of ৳${payout.amount.toLocaleString()} for ${payout.vendorName}:`,
      "Unconfirmed order delivery."
    );
    if (!reason) return;

    try {
      const res = await axios.patch("/api/admin/payouts", {
        payoutId: payout._id,
        status: "rejected",
        notes: reason,
      });

      if (res.data.success) {
        toast.success(`Payout request rejected.`);
        fetchPayouts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject payout.");
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    const matchesSearch =
      p.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
      p.vendorEmail?.toLowerCase().includes(search.toLowerCase()) ||
      p.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "pending") return p.status === "pending";
    if (filter === "approved") return p.status === "approved";
    if (filter === "rejected") return p.status === "rejected";

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-200/80 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-8 sm:p-10 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-4 py-1 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-400/20">
              <Banknote className="h-4 w-4" /> Seller Finance & Payouts
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Seller Payouts & Commission
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Review vendor withdrawal requests, audit gross sales vs platform commission fees, and disburse payouts via bKash, Nagad, or Bank Transfer.
            </p>
          </div>
        </div>

        {/* Financial Stats Bar */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-amber-200/60 dark:border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pending Payouts</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ৳{(stats.totalPending || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Disbursed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ৳{(stats.totalDisbursed || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Platform Commission</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ৳{(stats.totalCommissionEarned || 0).toLocaleString()}
              </p>
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
            placeholder="Search vendor name, email or transaction ID..."
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Requests" },
            { id: "pending", label: "Pending Review" },
            { id: "approved", label: "Approved & Paid" },
            { id: "rejected", label: "Rejected" },
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

      {/* Approval Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Banknote className="h-5 w-5 text-emerald-500" />
                Approve Vendor Payout
              </h2>
              <button
                onClick={() => setSelectedPayout(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-4 space-y-1 text-xs">
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Vendor: {selectedPayout.shopName || selectedPayout.vendorName}
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Payout Amount: <strong className="text-base font-black">৳{selectedPayout.amount.toLocaleString()}</strong>
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Method & Account: {selectedPayout.paymentMethod} — {selectedPayout.accountDetails}
              </p>
            </div>

            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Transaction ID / Bank Reference *
                </label>
                <input
                  type="text"
                  required
                  value={txnInput}
                  onChange={(e) => setTxnInput(e.target.value)}
                  placeholder="e.g. TXN9842104928"
                  className="w-full font-mono font-bold rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Admin Note / Receipt Reference
                </label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Disbursed via bKash merchant payout..."
                  className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="rounded-xl border border-gray-300 dark:border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Confirm Payout"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payouts Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 text-amber-500 font-semibold">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading payout requests...
          </div>
        </div>
      ) : filteredPayouts.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-12 text-center shadow-sm">
          <Banknote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            No payout requests found.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            When sellers request withdrawals, they will appear here for review.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPayouts.map((payout) => {
            const isApproved = payout.status === "approved";
            const isRejected = payout.status === "rejected";

            return (
              <div
                key={payout._id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-xl ${
                  isApproved
                    ? "border-emerald-200 dark:border-emerald-500/20"
                    : isRejected
                    ? "border-red-200 dark:border-red-500/20 bg-red-50/10"
                    : "border-amber-200/80 dark:border-amber-500/20"
                }`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                        {payout.shopName || payout.vendorName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {payout.vendorEmail}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : isRejected
                          ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                      }`}
                    >
                      {isApproved ? "Approved & Paid" : isRejected ? "Rejected" : "Pending Review"}
                    </span>
                  </div>

                  {/* Payout Amount Card */}
                  <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Net Payout Amount
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                      ৳{payout.amount.toLocaleString()}
                    </p>

                    <div className="mt-2 flex items-center justify-between border-t border-gray-200/60 dark:border-white/5 pt-2 text-[11px]">
                      <span className="text-gray-500">Gross Sales: ৳{(payout.grossSales || payout.amount).toLocaleString()}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">Fee: ৳{(payout.commissionFee || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Account Details */}
                  <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-white/5 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5 text-amber-500" /> Payment Method:
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {payout.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 font-medium shrink-0">Account:</span>
                      <span className="font-bold text-right text-slate-800 dark:text-slate-200 line-clamp-2">
                        {payout.accountDetails}
                      </span>
                    </div>

                    {payout.transactionId && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium">Txn Reference:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {payout.transactionId}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" /> Requested:
                      </span>
                      <span>
                        {new Date(payout.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-2">
                  {!isApproved && !isRejected ? (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        onClick={() => setSelectedPayout(payout)}
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2 px-3 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition"
                      >
                        <Check className="h-4 w-4" /> Approve & Pay
                      </button>

                      <button
                        onClick={() => handleReject(payout)}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/10 py-2 px-3 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full text-xs text-gray-500 font-medium">
                      <span>Status: {payout.status}</span>
                      {payout.processedAt && (
                        <span>Paid on {new Date(payout.processedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
