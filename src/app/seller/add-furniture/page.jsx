'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { uploadImageToCloudinary } from '@/utils/cloudinary';
import { PlusSquare, ImagePlus, Tag, DollarSign, Package, Layers } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  oldPrice: z.string().optional(),
  stock: z.string().min(1, 'Stock quantity is required'),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  description: z.string().min(10, 'Provide a description (at least 10 chars)'),
  image: z.any().optional(),
});

export default function AddFurniturePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'Sofa',
      stock: '5',
      material: 'Wood & Leather',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let vendorEmail = session?.user?.email;
      let vendorName = session?.user?.name;

      if (!vendorEmail && typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          vendorEmail = parsed.email;
          vendorName = parsed.name;
        }
      }

      if (!vendorEmail) {
        toast.error('Vendor email not found. Please log in.');
        return;
      }

      let imageUrl = '';
      if (data.image?.[0]) {
        imageUrl = await uploadImageToCloudinary(data.image[0]);
      } else {
        imageUrl =
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop';
      }

      const res = await axios.post('/api/seller/furniture', {
        name: data.name,
        category: data.category,
        price: data.price,
        oldPrice: data.oldPrice,
        stock: data.stock,
        material: data.material,
        dimensions: data.dimensions,
        description: data.description,
        image: imageUrl,
        vendorEmail,
        vendorName,
      });

      if (res.data.success) {
        toast.success('Furniture item added successfully!');
        reset();
        router.push('/seller/my-furniture');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add furniture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <PlusSquare className="text-amber-500" size={32} />
          Add New Furniture Listing
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          List a new product in the marketplace catalog for customers to purchase.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Product Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Velvet Armchair"
              {...register('name')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="Sofa">Sofa</option>
              <option value="Chair">Chair</option>
              <option value="Dining">Dining</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Office">Office</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              placeholder="5"
              {...register('stock')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
            />
            {errors.stock && <p className="mt-1 text-xs text-red-400">{errors.stock.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Selling Price (৳) *
            </label>
            <input
              type="number"
              placeholder="15000"
              {...register('price')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
            />
            {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
          </div>

          {/* Old Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Regular Price (Optional ৳)
            </label>
            <input
              type="number"
              placeholder="18000"
              {...register('oldPrice')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Material
            </label>
            <input
              type="text"
              placeholder="Teak Wood / Fabric"
              {...register('material')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Dimensions
            </label>
            <input
              type="text"
              placeholder="e.g. 72 x 36 x 32 inches"
              {...register('dimensions')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Product Description *
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of craftsmanship, features, and warranty details..."
              {...register('description')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Product Image */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <ImagePlus size={18} className="text-amber-500" /> Upload Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('image')}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-amber-400 file:to-orange-500 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:opacity-90 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Adding Product...' : 'Publish Product Listing'}
        </button>
      </form>
    </div>
  );
}
