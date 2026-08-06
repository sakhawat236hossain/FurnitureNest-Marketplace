import React from "react";

export const metadata = {
  title: "Privacy Policy | FurnishNest",
  description: "Learn how FurnishNest protects your personal information and customer data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: August 2026</p>

        <div className="space-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account, saving items to your wishlist, or completing a Cash on Delivery order (Name, Mobile Phone, Email, Shipping Address).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
            <p>
              Your delivery information is shared securely with the assigned seller and logistics partner solely for order dispatch and Cash on Delivery collection. We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Data Security</h2>
            <p>
              We implement industry-standard encryption protocols and session verification to protect your account and personal details from unauthorized access.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
