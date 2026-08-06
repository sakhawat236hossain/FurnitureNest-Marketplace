"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    question: "How does Cash on Delivery (COD) work?",
    answer:
      "When placing an order on FurnishNest, simply select Cash on Delivery at checkout. You pay in cash directly to our delivery team after inspecting your furniture item at home.",
  },
  {
    question: "What is the estimated delivery time for my order?",
    answer:
      "Standard delivery takes 2–4 business days within metropolitan cities (Dhaka, Chittagong) and 5–7 business days for regional districts across Bangladesh.",
  },
  {
    question: "Can I inspect the furniture before making cash payment?",
    answer:
      "Yes! With our Cash on Delivery guarantee, you can inspect the outer packaging and furniture condition upon doorstep arrival before handing over cash payment.",
  },
  {
    question: "How do I become a vendor on FurnishNest?",
    answer:
      "Click on Register, select 'Seller / Vendor' as your role, and complete your profile. Once approved by our moderation team, you can start listing your furniture items.",
  },
  {
    question: "What if I receive a damaged or incorrect furniture piece?",
    answer:
      "Our customer support is available 24/7. Contact us within 48 hours of delivery with photos of the damaged item for an immediate replacement or full order cancellation.",
  },
  {
    question: "Do you offer custom furniture dimensions or made-to-order sets?",
    answer:
      "Yes! Many of our verified sellers accept custom upholstery and dimension requests. Use the Contact Us page to request a custom quote.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-1 text-sm font-semibold border border-amber-200 dark:border-amber-500/20">
            <HelpCircle size={16} /> Frequently Asked Questions
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Find quick answers to common questions regarding ordering, Cash on Delivery, and seller policies.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 text-center text-gray-500">
              No matching questions found.
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left font-bold text-gray-900 dark:text-white hover:text-amber-500 transition"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-amber-500" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
