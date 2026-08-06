import { dbConnect, collections } from "@/lib/dbConnect";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://furnishnest.com";

  let products = [];
  try {
    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const rawProducts = await furnitureCollection
      .find({ status: "approved", hidden: { $ne: true } })
      .project({ _id: 1, updatedAt: 1 })
      .toArray();
    
    products = rawProducts.map((product) => ({
      url: `${baseUrl}/product/${product._id.toString()}`,
      lastModified: product.updatedAt || new Date(),
    }));
  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  const staticRoutes = [
    "",
    "/categories",
    "/featured",
    "/latest",
    "/about",
    "/contact",
    "/faq",
    "/terms",
    "/privacy",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...products];
}
