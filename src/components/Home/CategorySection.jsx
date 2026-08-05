import Link from "next/link";
import { dbConnect, collections } from "@/lib/dbConnect";

const categoryImages = {
  Sofa: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop",
  Chair:
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=900&auto=format&fit=crop",
  Dining:
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop",
  Bedroom:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop",
  Office:
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=900&auto=format&fit=crop",
  Outdoor:
    "https://images.unsplash.com/photo-1449247613801-ab06418e2861?q=80&w=900&auto=format&fit=crop",
};

function getImageForCategory(name) {
  return (
    categoryImages[name] ||
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop"
  );
}

export default async function CategorySection() {
  const furnitureCollection = await dbConnect(collections.FURNITURE);
  const rawCategories = await furnitureCollection
    .find({ status: "approved", hidden: { $ne: true } })
    .project({ category: 1 })
    .toArray();

  const categories = [
    ...new Set(rawCategories.map((item) => item.category).filter(Boolean)),
  ];
  const filteredCategories = categories.slice(0, 6);

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Decorative blur */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 px-4 py-1 text-sm font-medium border border-amber-200 dark:border-amber-400/20 transition-colors duration-300">
            Shop by Category
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
            Discover Furniture for
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Every Space
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Explore live categories from our marketplace and filter products by
            the collections customers love.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((name) => (
              <Link
                key={name}
                href={`/categories?category=${encodeURIComponent(name.toLowerCase())}`}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:border-amber-400/20"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={getImageForCategory(name)}
                    alt={name}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-56 lg:h-64"
                  />
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">{name}</h3>

                      <p className="mt-1 text-xs sm:text-sm text-gray-200">
                        Explore Collection
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-amber-400 group-hover:text-black">
                      →
                    </div>
                  </div>
                </div>

                {/* Top badge */}
                <div className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-slate-900/80 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 backdrop-blur px-3 py-1 text-xs font-semibold transition-colors duration-300">
                  New
                </div>
              </Link>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-10 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No categories found yet. Add products to start building the
                marketplace categories.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40"
          >
            View All Categories
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
