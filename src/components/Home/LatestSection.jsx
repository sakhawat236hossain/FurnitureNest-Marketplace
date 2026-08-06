import React from 'react';
import Link from 'next/link';
import { dbConnect, collections } from '@/lib/dbConnect';
import LatestCards from './LatestCards';

export default async function LatestSection() {
  const furnitureCollection = await dbConnect(collections.FURNITURE);
  const rawProducts = await furnitureCollection
    .find({ status: 'approved', hidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();

  const products = rawProducts.map((doc) => JSON.parse(JSON.stringify(doc)));

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Decorative Blur */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 px-4 py-1 text-sm font-medium border border-amber-200 dark:border-amber-400/20 backdrop-blur">
            ✨ Latest Collection
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            Fresh Arrivals for
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Modern Living
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400">
            Discover the newest additions to our premium furniture collection,
            carefully selected for style, comfort and craftsmanship.
          </p>
        </div>

        {/* Dynamic Animated Cards from Database */}
        <LatestCards products={products} />

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/latest"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white backdrop-blur transition-all duration-300 hover:border-amber-400 hover:text-amber-500 dark:hover:border-amber-400 dark:hover:text-amber-300 shadow-lg hover:shadow-xl hover:shadow-amber-500/10"
          >
            Browse All New Arrivals
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}