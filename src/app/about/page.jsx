import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Award, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | FurnishNest",
  description: "Learn more about FurnishNest, our artisanal furniture craftsmen, and our mission to elevate modern living spaces.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Banner */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-amber-500/15 to-transparent pointer-events-none" />
          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1.5 text-xs font-semibold text-amber-300 border border-amber-400/30">
              <Sparkles size={16} /> Our Story & Values
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Crafting Living Spaces You Love
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              FurnishNest was founded with a singular vision: to bridge the gap between skilled furniture artisans, boutique design studios, and homeowners seeking timeless, high-quality furniture.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium Quality</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Every table, sofa, and bed frame undergoes rigorous quality assurance inspections before listing.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verified Vendors</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We partner strictly with authentic, vetted furniture sellers and master carpenters.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sustainable Wood</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Committed to eco-friendly solid wood sourcing and zero-waste craftsmanship practices.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Customer-Centric</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Enjoy nationwide Cash on Delivery, hassle-free returns, and 24/7 dedicated support.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Ready to Transform Your Home?</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Browse our curated collections of luxury sofas, dining sets, executive desks, and bedroom furniture.
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition"
          >
            Explore Marketplace
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
