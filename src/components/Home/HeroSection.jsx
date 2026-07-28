'use client';

import React from 'react';
import Link from 'next/link';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop',
    title: 'Luxury Sofa Collection',
    subtitle: 'Elegant comfort crafted for modern living rooms.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop',
    title: 'Modern Dining Spaces',
    subtitle: 'Create unforgettable family moments around premium tables.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop',
    title: 'Bedroom Furniture',
    subtitle: 'Relax in style with premium beds and bedroom sets.',
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[70vh] md:h-[75vh] lg:h-[80vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[70vh] md:h-[75vh] lg:h-[80vh] w-full">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Content */}
              <div className="relative z-10 flex h-full items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl text-white">
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-300 backdrop-blur">
                      ✨ Premium Furniture Collection
                    </span>

                    <h1 className="mt-5 text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight">
                      {slide.title}
                    </h1>

                    <p className="mt-5 text-base sm:text-lg leading-7 text-gray-200 max-w-xl">
                      {slide.subtitle}
                    </p>

                    {/* Buttons */}
                    <div className="mt-7 flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/featured"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105 hover:shadow-orange-500/40"
                      >
                        Shop Now
                      </Link>

                      <Link
                        href="/categories"
                        className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-amber-400 hover:text-amber-300"
                      >
                        Explore Categories
                      </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
                      <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          5k+
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-xs text-gray-300">
                          Happy Customers
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          500+
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-xs text-gray-300">
                          Premium Products
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          24/7
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-xs text-gray-300">
                          Support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}