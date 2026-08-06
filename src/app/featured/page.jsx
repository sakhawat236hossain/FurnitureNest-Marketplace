import Link from "next/link";
import { dbConnect, collections } from "@/lib/dbConnect";
import FeaturedCard from "@/components/Featured/FeaturedCard";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Featured Furniture | FurnishNest",
  description:
    "Browse handpicked premium furniture listings from our marketplace.",
};

export default async function FeaturedPage() {
  const furnitureCollection = await dbConnect(collections.FURNITURE);
  const featuredItems = await furnitureCollection
    .find({ featured: true, status: "approved", hidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-200/80 bg-white/90 p-8 sm:p-12 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80 backdrop-blur-md">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">
              <Sparkles className="h-4 w-4" /> Curated Collection
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Featured Furniture
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Browse our handpicked premium furniture listings from top sellers.
              These products are verified, curated for high quality, and ready
              for fast delivery.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-300">
                ✨ {featuredItems.length} Featured Item
                {featuredItems.length !== 1 ? "s" : ""}
              </span>
              <span>•</span>
              <span>100% Quality Checked</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {featuredItems.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-12 text-center shadow-sm">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              No featured furniture available yet.
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Add approved products to the featured collection from the admin
              dashboard.
            </p>
            <Link
              href="/categories"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-600 transition"
            >
              <ArrowLeft size={16} /> Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((product) => (
              <FeaturedCard key={product._id.toString()} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
