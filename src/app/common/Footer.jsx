import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative mt-24 overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-gray-300"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:pr-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-white shadow-lg shadow-amber-500/20">
                F
              </div>

              <div>
                <h3 className="text-2xl font-extrabold tracking-wide text-white">
                  FurnishNest
                </h3>

                <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                  Premium Furniture
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              Stylish, durable and comfortable furniture crafted to transform
              your home into a modern living space.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
                <p className="text-xs text-gray-400">Customer Support</p>
                <p className="text-sm font-semibold text-white">24/7 Available</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="transition hover:text-amber-400">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/categories"
                  className="transition hover:text-amber-400"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  href="/featured"
                  className="transition hover:text-amber-400"
                >
                  Featured Furniture
                </Link>
              </li>

              <li>
                <Link
                  href="/latest"
                  className="transition hover:text-amber-400"
                >
                  Latest Collection
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-amber-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-amber-400"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="transition hover:text-amber-400"
                >
                  FAQ & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">
              Contact
            </h4>

            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <span className="text-lg">📧</span>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p>support@furnishnest.com</p>
                </div>
              </li>

              <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <span className="text-lg">📞</span>
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p>+880 1700-000000</p>
                </div>
              </li>

              <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">
              Stay Connected
            </h4>

            <p className="text-sm leading-6 text-gray-400">
              Get updates on new arrivals, premium collections and exclusive
              furniture offers.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
              />

              <button className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] hover:shadow-orange-500/40">
                Subscribe
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              {[
                { name: 'Facebook', href: 'https://www.facebook.com/md.sakhawth.hossain', label: 'f' },
                { name: 'Instagram', href: 'https://instagram.com', label: '◎' },
                { name: 'X', href: 'https://x.com', label: '𝕏' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 backdrop-blur transition hover:border-amber-400 hover:bg-amber-400 hover:text-black hover:shadow-lg hover:shadow-amber-400/20"
                  aria-label={social.name}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 FurnishNest. All rights reserved.</p>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-amber-400 transition">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-amber-400 transition">
              Terms
            </Link>

            <Link href="/faq" className="hover:text-amber-400 transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}