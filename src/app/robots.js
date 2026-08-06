export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://furnishnest.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/seller/", "/dashboard/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
