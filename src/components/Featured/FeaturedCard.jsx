"use client";

import Link from "next/link";
import OrderButton from "@/components/Order/OrderButton";
import AddToWishlistButton from "@/components/Wishlist/AddToWishlistButton";
import { Sparkles, Star, Eye } from "lucide-react";

export default function FeaturedCard({ product }) {
  if (!product) return null;

  // Calculate discount percentage if oldPrice exists
  let discountPercent = 0;
  if (product.oldPrice && product.price) {
    const currentPrice =
      typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;
    const previousPrice =
      typeof product.oldPrice === "number"
        ? product.oldPrice
        : parseFloat(String(product.oldPrice).replace(/[^0-9.]/g, "")) || 0;
    if (previousPrice > currentPrice && previousPrice > 0) {
      discountPercent = Math.round(
        ((previousPrice - currentPrice) / previousPrice) * 100
      );
    }
  }

  const productId = product._id?.toString() || product.id || "";
  const productLink = productId ? `/product/${productId}` : "#";

  return (
    <article className="group relative flex flex-col justify-between h-full overflow-hidden rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1.5">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={productLink} className="block h-full w-full">
          <img
            src={product.images?.[0] || product.image || "/placeholder.png"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Featured Badge - Top Left */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/25 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Featured</span>
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute bottom-3.5 left-3.5 z-10 rounded-full bg-rose-500/90 backdrop-blur-md px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button - Top Right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <AddToWishlistButton product={product} variant="icon" />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 justify-between p-5 sm:p-6">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-400/10 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-400/20">
              {product.category || "Furniture"}
            </span>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating ?? "4.9"}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-3 text-lg sm:text-xl font-bold text-slate-900 dark:text-white transition-colors duration-200 group-hover:text-amber-500 line-clamp-1">
            <Link href={productLink}>{product.name}</Link>
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
            {product.description ||
              "Handcrafted premium furniture designed for elegance and maximum comfort."}
          </p>
        </div>

        {/* Bottom Section: Price & Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10">
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {typeof product.price === "number"
                ? `৳${product.price.toLocaleString()}`
                : product.price || "৳0"}
            </span>

            {product.oldPrice && (
              <span className="text-xs sm:text-sm font-medium text-slate-400 line-through">
                {typeof product.oldPrice === "number"
                  ? `৳${product.oldPrice.toLocaleString()}`
                  : product.oldPrice}
              </span>
            )}
          </div>

          {/* Responsive 2-Column Buttons Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <OrderButton
              product={product}
              className="w-full text-xs sm:text-sm py-2.5 px-2"
            />

            <Link
              href={productLink}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Eye className="h-4 w-4" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
