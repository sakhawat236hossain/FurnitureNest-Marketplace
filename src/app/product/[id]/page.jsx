import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { dbConnect, collections } from "@/lib/dbConnect";
import OrderButton from "@/components/Order/OrderButton";
import AddToWishlistButton from "@/components/Wishlist/AddToWishlistButton";

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!ObjectId.isValid(id)) {
    return notFound();
  }

  let product = null;
  try {
    const furnitureCollection = await dbConnect(collections.FURNITURE);
    product = await furnitureCollection.findOne({
      _id: new ObjectId(id),
      status: "approved",
      hidden: { $ne: true },
    });
  } catch (error) {
    console.error("Product page fetch error:", error);
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-gray-200/80 bg-white/90 p-12 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Product not found
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            This furniture item may no longer be available or the link is
            invalid.
          </p>
          <div className="mt-8">
            <Link
              href="/categories"
              className="inline-flex rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02]"
            >
              Browse categories
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-8 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="lg:flex-1">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {(product.images || [product.image]).map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950"
                  >
                    <img
                      src={src || "/placeholder.png"}
                      alt={product.name}
                      className="h-80 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-[42rem]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
                {product.category || "General"}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
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

              <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-300">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Description
                  </h2>
                  <p className="mt-3 leading-7">
                    {product.description ||
                      "No description available for this item."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stock
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {product.stock ?? "N/A"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Availability
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {product.inStock ? "In stock" : "Out of stock"}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-5">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Details
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    <li>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Material:
                      </span>{" "}
                      {product.material || "Not specified"}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Dimensions:
                      </span>{" "}
                      {product.dimensions || "Not specified"}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Vendor:
                      </span>{" "}
                      {product.vendorName || "Vendor"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <OrderButton product={product} />
                  <AddToWishlistButton product={product} />
                </div>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-900 transition hover:border-amber-400 hover:text-amber-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  Back to categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
