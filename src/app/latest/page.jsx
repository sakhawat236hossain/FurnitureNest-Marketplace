import Link from "next/link";
import { dbConnect, collections } from "@/lib/dbConnect";
import OrderButton from "@/components/Order/OrderButton";
import AddToWishlistButton from "@/components/Wishlist/AddToWishlistButton";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Latest Furniture Collection | FurnishNest",
  description: "Browse the newest arrivals in furniture design, handpicked from top sellers.",
};

export default async function LatestPage() {
  const furnitureCollection = await dbConnect(collections.FURNITURE);
  const latestItems = await furnitureCollection
    .find({ status: "approved", hidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(24)
    .toArray();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <div className="rounded-[2.5rem] border border-gray-200/80 bg-white/90 p-8 sm:p-12 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-1 text-sm font-semibold border border-amber-200 dark:border-amber-500/20">
              <Sparkles size={16} /> New Arrivals
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">
              Latest Furniture Collection
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Explore the newest arrivals added by our verified sellers. Premium quality wood, modern aesthetics, ready for nationwide Cash on Delivery.
            </p>
          </div>
        </div>

        {latestItems.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              No new furniture listings available yet.
            </p>
            <Link
              href="/categories"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-600 transition"
            >
              <ArrowLeft size={16} /> Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {latestItems.map((product) => (
              <article
                key={product._id.toString()}
                className="group overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col"
              >
                <Link href={`/product/${product._id.toString()}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        product.images?.[0] || product.image || "/placeholder.png"
                      }
                      alt={product.name}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                        New
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                      {product.category || "Furniture"}
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                      <Link href={`/product/${product._id.toString()}`}>
                        {product.name}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {product.description || "High-quality furniture made for modern living spaces."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {typeof product.price === "number"
                          ? `৳${product.price.toLocaleString()}`
                          : product.price || "৳0"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <AddToWishlistButton product={product} />
                      <OrderButton product={product} variant="add" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
