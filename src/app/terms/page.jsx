import React from "react";

export const metadata = {
  title: "Terms of Service | FurnishNest",
  description: "Terms of service and marketplace usage rules for FurnishNest users and sellers.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: August 2026</p>

        <div className="space-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Marketplace Platform Overview</h2>
            <p>
              FurnishNest is a digital marketplace connecting buyers with verified furniture sellers. By accessing or placing orders on FurnishNest, you agree to comply with these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Cash on Delivery & Payment Policy</h2>
            <p>
              FurnishNest operates primarily on a Cash on Delivery (COD) model. Buyers are expected to pay the full agreed order amount in cash upon receiving and inspecting the goods.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Seller Responsibilities & Product Moderation</h2>
            <p>
              All furniture listed by sellers must accurately represent dimensions, wood materials, and colors. FurnishNest administrators reserve the right to remove non-compliant listings or suspend fraudulent seller accounts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Order Cancellation & Returns</h2>
            <p>
              Orders may be cancelled prior to dispatch. If a product arrives damaged or defective, buyers must notify customer care within 48 hours for immediate replacement processing.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
