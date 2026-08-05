import Link from "next/link";
import { dbConnect, collections } from "@/lib/dbConnect";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function CategoriesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const categoryQuery = resolvedSearchParams?.category
    ? String(resolvedSearchParams.category)
    : "";
  const searchQuery = resolvedSearchParams?.search
    ? String(resolvedSearchParams.search)
    : "";

  const furnitureCollection = await dbConnect(collections.FURNITURE);
  const rawCategories = await furnitureCollection
    .find({ status: "approved", hidden: { $ne: true } })
    .project({ category: 1 })
    .toArray();

  const categories = [
    ...new Set(rawCategories.map((item) => item.category).filter(Boolean)),
  ];

  const query = {
    status: "approved",
    hidden: { $ne: true },
  };

  if (categoryQuery) {
    query.category = {
      $regex: `^${escapeRegExp(categoryQuery)}$`,
      $options: "i",
    };
  }

  if (searchQuery) {
    query.$or = [
      { name: { $regex: escapeRegExp(searchQuery), $options: "i" } },
      { description: { $regex: escapeRegExp(searchQuery), $options: "i" } },
      { category: { $regex: escapeRegExp(searchQuery), $options: "i" } },
    ];
  }

  const products = await furnitureCollection
    .find(query)
    .sort({ createdAt: -1 })
    .limit(36)
    .toArray();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-10 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
            Shop by category
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Browse Furniture Categories
          </h1>
          <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-300">
            Filter products by category or search across names and descriptions.
          </p>

          <form
            className="mt-8 grid gap-4 sm:grid-cols-[1.4fr_0.6fr]"
            action="/categories"
            method="get"
          >
            <div>
              <label className="sr-only" htmlFor="search">
                Search furniture
              </label>
              <input
                id="search"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search furniture, category or description"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300 dark:focus:ring-amber-500/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02]"
            >
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/categories"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                !categoryQuery
                  ? "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-300 dark:bg-amber-500/10 dark:text-amber-200"
                  : "border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-slate-950 dark:text-gray-300"
              }`}
            >
              All
            </Link>
            {categories.filter(Boolean).map((category) => {
              const normalized = category.toLowerCase();
              const active = normalized === categoryQuery.toLowerCase();
              return (
                <Link
                  key={category}
                  href={`/categories?category=${encodeURIComponent(normalized)}${
                    searchQuery
                      ? `&search=${encodeURIComponent(searchQuery)}`
                      : ""
                  }`}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-300 dark:bg-amber-500/10 dark:text-amber-200"
                      : "border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-slate-950 dark:text-gray-300"
                  }`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.55fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-8 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
                    Products
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {searchQuery || categoryQuery
                      ? "Matching results"
                      : "Top listings"}
                  </h2>
                </div>
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {products.length} item{products.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-12 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  No products found
                </p>
                <p className="mt-3 text-gray-500 dark:text-gray-400">
                  Try changing your search or selecting a different category.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product._id.toString()}
                    className="overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10"
                  >
                    <Link href={`/product/${product._id.toString()}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            product.images?.[0] ||
                            product.image ||
                            "/placeholder.png"
                          }
                          alt={product.name}
                          className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                        {product.category || "General"}
                      </span>
                      <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                        <Link href={`/product/${product._id.toString()}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-3">
                        {product.description ||
                          "High-quality furniture made for modern living."}
                      </p>
                      <div className="mt-6 flex items-center justify-between gap-4">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {typeof product.price === "number"
                            ? `৳${product.price.toLocaleString()}`
                            : product.price || "৳0"}
                        </p>
                        <Link
                          href={`/product/${product._id.toString()}`}
                          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 dark:bg-white dark:text-black"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Popular Categories
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Click a category to filter the live marketplace items.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {categories.filter(Boolean).map((category) => (
                <Link
                  key={category}
                  href={`/categories?category=${encodeURIComponent(category.toLowerCase())}`}
                  className="rounded-full border border-gray-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300"
                >
                  {category}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
