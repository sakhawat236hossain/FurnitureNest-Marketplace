import React from 'react';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Luxury Velvet Sofa',
    price: '৳25,000',
    oldPrice: '৳30,000',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Modern Wooden Chair',
    price: '৳8,500',
    oldPrice: '৳10,000',
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=900&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Premium Dining Table',
    price: '৳18,000',
    oldPrice: '৳22,000',
    image:
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop',
    rating: 5.0,
  },
  {
    id: 4,
    name: 'Elegant Bedroom Set',
    price: '৳45,000',
    oldPrice: '৳52,000',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop',
    rating: 4.7,
  },
];

export default function FeaturedSection() {
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
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:border-amber-400/20"
            >
              {/* Discount badge */}
              <div className="absolute left-4 top-4 z-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                -15%
              </div>

              {/* Wishlist button */}
              <button className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/80 text-gray-700 dark:text-gray-200 backdrop-blur border border-gray-200 dark:border-white/10 transition hover:bg-amber-400 hover:text-black">
                ♥
              </button>

              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={product.image}
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
                    {product.rating}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
                    {product.price}
                  </span>

                  <span className="text-sm text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/product/${product.id}`}
                    className="flex-1 rounded-xl border border-gray-300 dark:border-white/10 px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white transition hover:border-amber-400 hover:text-amber-500 dark:hover:border-amber-400 dark:hover:text-amber-300"
                  >
                    Details
                  </Link>

                  <button className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] hover:shadow-orange-500/40">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
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