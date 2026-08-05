import Link from "next/link";
import { dbConnect, collections } from "@/lib/dbConnect";
import OrderButton from "@/components/Order/OrderButton";
import AddToWishlistButton from "@/components/Wishlist/AddToWishlistButton";

export default async function FeaturedSection() {
  const furnitureCollection = await dbConnect(collections.FURNITURE);
  const products = await furnitureCollection
    .find({ featured: true, status: "approved", hidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(4)
    .toArray();

  return (
    <section className="relative overflow-hidden py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Decorative blur */}
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 px-4 py-1 text-sm font-medium border border-amber-200 dark:border-amber-400/20 transition-colors duration-300">
              Featured Collection
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
              Handpicked Furniture
              <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Best Sellers
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Explore our most loved premium furniture pieces chosen by
              thousands of happy customers.
            </p>
          </div>

          <Link
            href="/featured"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white backdrop-blur transition-all duration-300 hover:border-amber-400 hover:text-amber-500 dark:hover:border-amber-400 dark:hover:text-amber-300"
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id.toString()}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:border-amber-400/20"
              >
                {/* Discount badge */}
                <div className="absolute left-4 top-4 z-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  Featured
                </div>

                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={
                      product.images?.[0] || product.image || "/placeholder.png"
                    }
                    alt={product.name}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-amber-400">★★★★★</span>
                    <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {product.rating ?? "4.8"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
                      {typeof product.price === "number"
                        ? `৳${product.price.toLocaleString()}`
                        : product.price || "৳0"}
                    </span>

                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {typeof product.oldPrice === "number"
                          ? `৳${product.oldPrice.toLocaleString()}`
                          : product.oldPrice}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={
                        product._id ? `/product/${product._id.toString()}` : "#"
                      }
                      className="flex-1 rounded-xl border border-gray-300 dark:border-white/10 px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white transition hover:border-amber-400 hover:text-amber-500 dark:hover:border-amber-400 dark:hover:text-amber-300"
                    >
                      Details
                    </Link>

                    <div className="flex gap-2 flex-1 flex-wrap">
                      <div className="flex-1 min-w-[10rem]">
                        <OrderButton product={product} />
                      </div>
                      <div className="flex-1 min-w-[10rem]">
                        <AddToWishlistButton product={product} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-4 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-10 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No featured furniture available right now.
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-3xl border border-gray-200 dark:border-white/10 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-400/10 dark:to-orange-500/10 p-8 text-center backdrop-blur transition-colors duration-300">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Looking for Custom Furniture?
          </h3>

          <p className="mt-3 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            We design made-to-order furniture tailored to your home and style.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105 hover:shadow-orange-500/40"
          >
            Request a Quote
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
