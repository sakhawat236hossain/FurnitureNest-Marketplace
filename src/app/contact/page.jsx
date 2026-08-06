"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent to our support team.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-1 text-sm font-semibold border border-amber-200 dark:border-amber-500/20">
            Customer Care & Inquiry
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            We’d Love to Hear From You
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Have questions about custom furniture, order delivery status, or seller partnerships? Get in touch with our team.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Info Cards */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Email Us</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">support@furnishnest.com</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">info@furnishnest.com</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Call Us</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+880 1700-000000</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">+880 1900-000000</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Our Showroom</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  124 Gulshan Avenue, Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Working Hours</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Saturday – Thursday: 9 AM – 9 PM</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Friday: 2 PM – 9 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="text-amber-500" size={24} />
              Send Us a Direct Message
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject *
                </label>
                <input
                  required
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Inquiry about custom sofa design"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition disabled:opacity-60"
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
