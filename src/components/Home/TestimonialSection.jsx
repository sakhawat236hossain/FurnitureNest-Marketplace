'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Sakib Hasan',
    role: 'Home Owner',
    image: 'https://i.pravatar.cc/100?img=12',
    rating: 5,
    review:
      'The sofa quality exceeded my expectations. Delivery was fast and the customer support was excellent. My living room now looks premium.',
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    role: 'Interior Designer',
    image: 'https://i.pravatar.cc/100?img=32',
    rating: 5,
    review:
      'Beautiful craftsmanship and modern design. I regularly recommend FurnishNest to my interior design clients because of their reliability.',
  },
  {
    id: 3,
    name: 'Mahmud Rahman',
    role: 'Business Owner',
    image: 'https://i.pravatar.cc/100?img=15',
    rating: 5,
    review:
      'We furnished our office through FurnishNest and the result is outstanding. Stylish furniture with professional service from start to finish.',
  },
  {
    id: 4,
    name: 'Tania Akter',
    role: 'Apartment Owner',
    image: 'https://i.pravatar.cc/100?img=47',
    rating: 5,
    review:
      'The dining set fits perfectly in our apartment. Premium materials, elegant finish and very comfortable for everyday family use.',
  },
];

export default function TestimonialSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated glow background */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -40, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 60, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 px-4 py-1 text-sm font-medium border border-amber-200 dark:border-amber-400/20 backdrop-blur">
            Client Reviews
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            What Our Customers
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400">
            Thousands of homeowners and businesses trust FurnishNest for
            premium furniture, elegant design and reliable service.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="mt-16">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-full overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20"
                >
                  {/* Light streak animation */}
                  <motion.div
                    animate={{ x: ['-120%', '120%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent blur-sm"
                  />

                  {/* Quote icon */}
                  <div className="absolute right-6 top-6 text-5xl text-amber-400/20 dark:text-amber-300/10">
                    “
                  </div>

                  {/* User */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-full border-2 border-amber-400 object-cover shadow-md"
                    />

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mt-5 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  {/* Review */}
                  <p className="mt-5 text-gray-600 dark:text-gray-300 leading-7 text-sm sm:text-base">
                    {item.review}
                  </p>

                  {/* Bottom accent */}
                  <div className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Bottom Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-6 py-4 backdrop-blur-xl shadow-lg">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              ⭐ Rated <span className="font-bold text-amber-500">4.9/5</span> by
              more than <span className="font-bold text-amber-500">5,000+ customers</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}