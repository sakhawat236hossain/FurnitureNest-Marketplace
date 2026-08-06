'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSection() {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated glow backgrounds */}
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:24px_24px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/10 bg-white/60 dark:bg-white/5 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 shadow-[0_20px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl"
        >
          {/* Animated top glow line */}
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          />

          {/* Decorative gradient ring */}
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] p-[1px]">
            <div className="h-full w-full rounded-[2.5rem] bg-gradient-to-r from-amber-400/40 via-white/10 to-orange-500/40" />
          </div>

          {/* Floating icon */}
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 text-3xl shadow-[0_10px_30px_rgba(251,191,36,0.35)] ring-1 ring-white/20"
          >
            ✉️
          </motion.div>

          {/* Content */}
          <div className="mt-5 text-center">
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 px-4 py-1 text-sm font-medium border border-amber-200 dark:border-amber-400/20 backdrop-blur">
              Join Our Newsletter
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              Get Exclusive Furniture
              <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Offers & Design Tips
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-7 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center">
              Subscribe to receive new arrivals, interior inspiration, seasonal
              discounts and premium furniture offers directly in your inbox.
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center max-w-4xl mx-auto"
          >
            <div className="w-full flex-1 sm:min-w-0">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  📧
                </span>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded-2xl border border-white/40 dark:border-white/10 bg-white/90 dark:bg-white/5 py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none backdrop-blur-xl shadow-inner transition-all duration-300 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-400/20 dark:focus:border-amber-400 dark:focus:bg-white/10 dark:focus:ring-amber-400/10"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(249,115,22,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(249,115,22,0.55)] active:translate-y-0"
            >
              {/* Shine effect */}
              <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[260%]" />

              <span className="relative">Subscribe</span>

              <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          </motion.form>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            🔒 We respect your privacy. No spam, unsubscribe anytime.
          </motion.p>

          {/* Bottom trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-5xl mx-auto"
          >
            {[
              { value: '5k+', label: 'Subscribers' },
              { value: 'Weekly', label: 'Design Tips' },
              { value: 'Exclusive', label: 'Offers' },
              { value: '100%', label: 'Free' },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-3 text-center backdrop-blur-xl shadow-sm transition-transform duration-300 hover:shadow-lg"
              >
                <p className="text-xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
