"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import {
  Package,
  CheckCircle,
  XCircle,
  Trash2,
  Tag,
  Store,
  ImagePlus,
  Pencil,
  Plus,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  oldPrice: z.string().optional(),
  stock: z.string().min(1, "Stock quantity is required"),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  description: z.string().min(10, "Provide a description (at least 10 chars)"),
  image: z.any().optional(),
  status: z.string().optional(),
});

export default function AdminFurniturePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const addForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "Sofa",
      stock: "5",
      material: "Wood",
      status: "approved",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "Sofa",
      stock: "5",
      material: "Wood",
      status: "approved",
    },
  });

  useEffect(() => {
    fetchFurniture();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedItem) {
      editForm.reset({
        name: selectedItem.name,
        category: selectedItem.category,
        price: selectedItem.price?.toString() || "",
        oldPrice: selectedItem.oldPrice?.toString() || "",
        stock: selectedItem.stock?.toString() || "1",
        material: selectedItem.material || "Wood",
        dimensions: selectedItem.dimensions || "",
        description: selectedItem.description || "",
        status: selectedItem.status || "approved",
      });
    }
  }, [selectedItem, editForm]);

  const featuredCount = useMemo(
    () => items.filter((item) => item.featured).length,
    [items],
  );

  const fetchFurniture = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/furniture?status=${statusFilter}`,
      );
      if (res.data.success) {
        setItems(res.data.furniture);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch furniture listings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      setProcessing(true);
      const imageUrl = data.image?.[0]
        ? await uploadImageToCloudinary(data.image[0])
        : "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop";

      const res = await axios.post("/api/admin/furniture", {
        name: data.name,
        category: data.category,
        price: data.price,
        oldPrice: data.oldPrice,
        stock: data.stock,
        material: data.material,
        dimensions: data.dimensions,
        description: data.description,
        image: imageUrl,
        vendorEmail: "admin@furnish.com",
        vendorName: "Admin",
        status: data.status || "approved",
      });

      if (res.data.success) {
        toast.success("New product created successfully");
        addForm.reset({
          category: "Sofa",
          stock: "5",
          material: "Wood",
          status: "approved",
        });
        fetchFurniture();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setProcessing(false);
    }
  };

  const handleEditProduct = async (data) => {
    if (!selectedItem) return;
    try {
      setProcessing(true);
      let imageUrl = selectedItem.image;
      if (data.image?.[0]) {
        imageUrl = await uploadImageToCloudinary(data.image[0]);
      }

      const res = await axios.patch("/api/admin/furniture", {
        furnitureId: selectedItem._id,
        name: data.name,
        category: data.category,
        price: data.price,
        oldPrice: data.oldPrice,
        stock: data.stock,
        material: data.material,
        dimensions: data.dimensions,
        description: data.description,
        image: imageUrl,
        status: data.status || "approved",
      });

      if (res.data.success) {
        toast.success("Product updated successfully");
        setSelectedItem(null);
        fetchFurniture();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (furnitureId, newStatus) => {
    try {
      const res = await axios.patch("/api/admin/furniture", {
        furnitureId,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Product ${newStatus}`);
        fetchFurniture();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleToggleFeature = async (item) => {
    try {
      const res = await axios.patch("/api/admin/furniture", {
        furnitureId: item._id,
        featured: !item.featured,
      });

      if (res.data.success) {
        toast.success(
          item.featured ? "Item removed from featured" : "Item featured",
        );
        fetchFurniture();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to toggle featured state",
      );
    }
  };

  const handleDelete = async (furnitureId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await axios.delete(
        `/api/admin/furniture?furnitureId=${furnitureId}`,
      );
      if (res.data.success) {
        toast.success("Furniture item deleted");
        fetchFurniture();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Package className="text-amber-500" size={32} />
              Manage Furniture
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add, edit, approve, feature, and remove marketplace product
              listings.
            </p>
          </div>
          <div className="rounded-3xl bg-amber-50 dark:bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200 shadow-sm">
            Featured items: {featuredCount} / 6
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add New Product
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload a Cloudinary image and publish a new furniture listing
              instantly.
            </p>
            <form
              onSubmit={addForm.handleSubmit(handleAddProduct)}
              className="mt-6 grid gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Product Title"
                  error={addForm.formState.errors.name?.message}
                  {...addForm.register("name")}
                />
                <SelectField label="Category" {...addForm.register("category")}>
                  <option value="Sofa">Sofa</option>
                  <option value="Chair">Chair</option>
                  <option value="Dining">Dining</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Office">Office</option>
                  <option value="Outdoor">Outdoor</option>
                </SelectField>
                <InputField
                  label="Price (৳)"
                  type="number"
                  error={addForm.formState.errors.price?.message}
                  {...addForm.register("price")}
                />
                <InputField
                  label="Regular Price"
                  type="number"
                  {...addForm.register("oldPrice")}
                />
                <InputField
                  label="Stock"
                  type="number"
                  error={addForm.formState.errors.stock?.message}
                  {...addForm.register("stock")}
                />
                <InputField
                  label="Material"
                  {...addForm.register("material")}
                />
                <InputField
                  label="Dimensions"
                  {...addForm.register("dimensions")}
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    {...addForm.register("status")}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...addForm.register("description")}
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
                />
                {addForm.formState.errors.description && (
                  <p className="mt-1 text-xs text-red-400">
                    {addForm.formState.errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  <ImagePlus size={18} className="text-amber-500" /> Product
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...addForm.register("image")}
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-amber-400 file:to-orange-500 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
                />
              </div>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-60"
              >
                <Plus size={18} /> {processing ? "Saving..." : "Create Product"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 overflow-hidden shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Product Inventory
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Approve, reject, feature, edit, or delete product listings.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", "approved", "pending", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-2xl px-4 py-2 text-xs font-bold capitalize transition ${
                      statusFilter === status
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="pb-4">Item</th>
                    <th className="pb-4">Vendor</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Featured</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-16 text-center text-gray-500 dark:text-gray-400"
                      >
                        Loading items...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-16 text-center text-gray-500 dark:text-gray-400"
                      >
                        No items found.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                      >
                        <td className="py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400">
                              <Package size={18} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.category || "General"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600 dark:text-gray-300">
                          <p className="text-sm font-medium">
                            {item.vendorName || "Vendor"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.vendorEmail}
                          </p>
                        </td>
                        <td className="py-4 font-bold text-gray-900 dark:text-white">
                          ৳{(item.price || 0).toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              item.status === "approved"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                : item.status === "rejected"
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                            }`}
                          >
                            {item.status || "pending"}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleFeature(item)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              item.featured
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            <Star size={12} />{" "}
                            {item.featured ? "Featured" : "Feature"}
                          </button>
                        </td>
                        <td className="py-4 text-right space-y-2 sm:space-y-0 sm:flex sm:justify-end sm:items-center sm:gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-800 transition"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                item._id,
                                item.status === "approved"
                                  ? "rejected"
                                  : "approved",
                              )
                            }
                            className="rounded-xl bg-amber-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-600 transition"
                          >
                            {item.status === "approved" ? "Reject" : "Approve"}
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.name)}
                            className="rounded-xl bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Product
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update the listing details and status for this product.
              </p>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-950 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 transition"
            >
              Cancel Edit
            </button>
          </div>

          <form
            onSubmit={editForm.handleSubmit(handleEditProduct)}
            className="mt-6 grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Product Title"
                error={editForm.formState.errors.name?.message}
                {...editForm.register("name")}
              />
              <SelectField label="Category" {...editForm.register("category")}>
                <option value="Sofa">Sofa</option>
                <option value="Chair">Chair</option>
                <option value="Dining">Dining</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Office">Office</option>
                <option value="Outdoor">Outdoor</option>
              </SelectField>
              <InputField
                label="Price (৳)"
                type="number"
                error={editForm.formState.errors.price?.message}
                {...editForm.register("price")}
              />
              <InputField
                label="Regular Price"
                type="number"
                {...editForm.register("oldPrice")}
              />
              <InputField
                label="Stock"
                type="number"
                error={editForm.formState.errors.stock?.message}
                {...editForm.register("stock")}
              />
              <InputField label="Material" {...editForm.register("material")} />
              <InputField
                label="Dimensions"
                {...editForm.register("dimensions")}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Status
                </label>
                <select
                  {...editForm.register("status")}
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                rows={4}
                {...editForm.register("description")}
                className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
              />
              {editForm.formState.errors.description && (
                <p className="mt-1 text-xs text-red-400">
                  {editForm.formState.errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <ImagePlus size={18} className="text-amber-500" /> Replace Image
              </label>
              <input
                type="file"
                accept="image/*"
                {...editForm.register("image")}
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-amber-400 file:to-orange-500 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-60"
            >
              <Pencil size={18} />{" "}
              {processing ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function InputField({ label, error, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
      >
        {children}
      </select>
    </div>
  );
}
