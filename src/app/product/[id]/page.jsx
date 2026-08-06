import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { ArrowLeft, Box, Check, Ruler, ShieldCheck, Truck } from "lucide-react";
import { dbConnect, collections } from "@/lib/dbConnect";
import OrderButton from "@/components/Order/OrderButton";
import AddToWishlistButton from "@/components/Wishlist/AddToWishlistButton";

export default async function ProductPage({ params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) notFound();

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
      <main className="min-h-screen bg-stone-50 px-4 py-20 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-xl shadow-stone-200/50 dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">Unavailable</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Product not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">This furniture item may no longer be available.</p>
          <Link href="/categories" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-500 dark:bg-amber-500">
            <ArrowLeft size={17} /> Browse products
          </Link>
        </div>
      </main>
    );
  }

  const productImages = (product.images?.filter(Boolean)?.length
    ? product.images.filter(Boolean)
    : [product.image || "/placeholder.png"]
  ).slice(0, 3);
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/categories" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400">
          <ArrowLeft size={17} /> Back to collection
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-stone-200/90 bg-white shadow-[0_24px_70px_-30px_rgba(41,37,36,0.3)] dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-stone-200/80 bg-stone-100 p-3 dark:border-white/10 dark:bg-slate-950 lg:border-b-0 lg:border-r">
              <div className="grid min-h-[360px] grid-cols-1 gap-3 sm:min-h-[580px] sm:grid-cols-[1.35fr_0.65fr] sm:grid-rows-2">
                <div className="relative overflow-hidden rounded-[1.45rem] bg-stone-200 dark:bg-slate-800 sm:row-span-2">
                  <img src={productImages[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                  {discount > 0 && <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">-{discount}% OFF</span>}
                </div>
                {productImages.slice(1).map((image, index) => (
                  <div key={image} className="hidden overflow-hidden rounded-[1.2rem] bg-stone-200 dark:bg-slate-800 sm:block">
                    <img src={image} alt={`${product.name} view ${index + 2}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-9 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">{product.category || "Furniture"}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${product.inStock ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"}`}>
                  <Check size={13} /> {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl xl:text-5xl">{product.name}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{product.description || "Thoughtfully designed furniture made to bring comfort and character to your home."}</p>

              <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2 border-y border-stone-200 py-6 dark:border-white/10">
                <p className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">৳{price.toLocaleString()}</p>
                {oldPrice > price && <p className="pb-1 text-base font-medium text-slate-400 line-through">৳{oldPrice.toLocaleString()}</p>}
                {discount > 0 && <p className="pb-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">You save ৳{(oldPrice - price).toLocaleString()}</p>}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <InfoCard icon={Box} label="Stock" value={product.stock ?? "Available"} />
                <InfoCard icon={Ruler} label="Dimensions" value={product.dimensions || "On request"} />
                <InfoCard icon={ShieldCheck} label="Material" value={product.material || "Premium quality"} />
                <InfoCard icon={Truck} label="Seller" value={product.vendorName || "FurnishNest seller"} />
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-7 dark:border-white/10 sm:flex-row">
                <OrderButton product={product} />
                <AddToWishlistButton product={product} />
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Order request is sent directly to the seller for approval.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-white/10 dark:bg-slate-950">
      <Icon size={18} className="text-amber-600 dark:text-amber-400" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white" title={String(value)}>{value}</p>
    </div>
  );
}
