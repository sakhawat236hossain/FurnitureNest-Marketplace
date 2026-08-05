import Link from "next/link";
import { dbConnect, collections } from "@/lib/dbConnect";
import OrderButton from "@/components/Order/OrderButton";
import AddToWishlistButton from "@/components/Wishlist/AddToWishlistButton";

export default async function FeaturedPage() {
  const furnitureCollection = await dbConnect(collections.FURNITURE);
  const featuredItems = await furnitureCollection
    .find({ featured: true, status: "approved", hidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border border-gray-200/80 bg-white/90 p-10 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
              Featured
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Explore Featured Furniture
            </h1>
            <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-300">
              Browse our handpicked premium furniture listings from the
              marketplace. These products are approved, curated by our team, and
              ready to ship.
            </p>
          </div>
        </div>

        {featuredItems.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-12 text-center shadow-sm">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              No featured furniture available yet.
            </p>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Add approved products to the featured collection from the admin
              dashboard.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featuredItems.map((product) => (
              <div
                key={product._id.toString()}
                className="group overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      product.images?.[0] || product.image || "/placeholder.png"
                    }
                    alt={product.name}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                    <span className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                    {product.category || "General"}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-3">
                    {product.description ||
                      "Premium furniture with quality materials and modern design."}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {typeof product.price === "number"
                          ? `৳${product.price.toLocaleString()}`
                          : product.price || "৳0"}
                      </p>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {typeof product.oldPrice === "number"
                            ? `৳${product.oldPrice.toLocaleString()}`
                            : product.oldPrice}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <OrderButton product={product} />
                      <AddToWishlistButton product={product} />
                    </div>
                    <Link
                      href={
                        product._id ? `/product/${product._id.toString()}` : "#"
                      }
                      className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
