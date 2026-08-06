"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import {
  Package,
  Trash2,
  ImagePlus,
  Pencil,
  Plus,
  Star,
  X,
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // NEW: controls Add Product modal

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
        setIsAddModalOpen(false); // NEW: close modal on success
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
    <div className="space-y-6 p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <Package className="text-amber-500 shrink-0" size={28} />
              <span>Manage Furniture</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add, edit, approve, feature, and remove marketplace product
              listings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl sm:rounded-3xl bg-amber-50 dark:bg-amber-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-200 shadow-sm whitespace-nowrap">
              Featured: {featuredCount} / 6
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] whitespace-nowrap"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {["all", "approved", "pending", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-3 sm:px-4 py-2 text-xs font-bold capitalize transition ${
                statusFilter === status
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Inventory Section */}
        <div className="mt-6 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Product Inventory
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Approve, reject, feature, edit, or delete product listings.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              Loading items...
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              No items found.
            </div>
          ) : (
            <>
              {/* Desktop table view (md and up) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Vendor</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                      >
                        <td className="p-4 font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 shrink-0">
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
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">
                          <p className="text-sm font-medium">
                            {item.vendorName || "Vendor"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.vendorEmail}
                          </p>
                        </td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                          ৳{(item.price || 0).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="p-4">
                          <FeatureButton item={item} onClick={handleToggleFeature} />
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap justify-end items-center gap-2">
                            <ActionButtons
                              item={item}
                              onEdit={setSelectedItem}
                              onStatusChange={handleStatusChange}
                              onDelete={handleDelete}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card view (below md) */}
              <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
                {items.map((item) => (
                  <div key={item._id} className="p-4">
                    <div className="flex items-start gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 shrink-0">
                          <Package size={18} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.category || "General"}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            ৳{(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.vendorName || "Vendor"} · {item.vendorEmail}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <StatusBadge status={item.status} />
                          <FeatureButton item={item} onClick={handleToggleFeature} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ActionButtons
                        item={item}
                        onEdit={setSelectedItem}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Product (inline card, same as before) */}
      {selectedItem && (
        <div className="rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Edit Product
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update the listing details and status for this product.
              </p>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="self-start sm:self-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-950 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 transition"
            >
              Cancel Edit
            </button>
          </div>

          <form
            onSubmit={editForm.handleSubmit(handleEditProduct)}
            className="mt-6 grid gap-4"
          >
            <ProductFormFields form={editForm} />
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-60"
            >
              <Pencil size={18} />{" "}
              {processing ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Add New Product
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Upload a Cloudinary image and publish a new furniture
                  listing instantly.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-white transition shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={addForm.handleSubmit(handleAddProduct)}
              className="mt-6 grid gap-4"
            >
              <ProductFormFields form={addForm} />
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-60"
              >
                <Plus size={18} /> {processing ? "Saving..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared form fields — used by both Add modal and Edit card so markup stays in sync
function ProductFormFields({ form }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Product Title"
          error={form.formState.errors.name?.message}
          {...form.register("name")}
        />
        <SelectField label="Category" {...form.register("category")}>
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
          error={form.formState.errors.price?.message}
          {...form.register("price")}
        />
        <InputField label="Regular Price" type="number" {...form.register("oldPrice")} />
        <InputField
          label="Stock"
          type="number"
          error={form.formState.errors.stock?.message}
          {...form.register("stock")}
        />
        <InputField label="Material" {...form.register("material")} />
        <InputField label="Dimensions" {...form.register("dimensions")} />
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Status
          </label>
          <select
            {...form.register("status")}
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
          {...form.register("description")}
          className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 transition"
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-xs text-red-400">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
          <ImagePlus size={18} className="text-amber-500" /> Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          {...form.register("image")}
          className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-amber-400 file:to-orange-500 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
        />
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ${
        status === "approved"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          : status === "rejected"
            ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
            : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
      }`}
    >
      {status || "pending"}
    </span>
  );
}

function FeatureButton({ item, onClick }) {
  return (
    <button
      onClick={() => onClick(item)}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
        item.featured
          ? "bg-emerald-500 text-white"
          : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
      }`}
    >
      <Star size={12} /> {item.featured ? "Featured" : "Feature"}
    </button>
  );
}

function ActionButtons({ item, onEdit, onStatusChange, onDelete }) {
  return (
    <>
      <button
        onClick={() => onEdit(item)}
        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-800 transition"
      >
        <Pencil size={14} /> Edit
      </button>
      <button
        onClick={() =>
          onStatusChange(item._id, item.status === "approved" ? "rejected" : "approved")
        }
        className="inline-flex items-center gap-1 rounded-xl bg-amber-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-600 transition"
      >
        {item.status === "approved" ? "Reject" : "Approve"}
      </button>
      <button
        onClick={() => onDelete(item._id, item.name)}
        className="inline-flex items-center gap-1 rounded-xl bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition"
      >
        <Trash2 size={14} /> Delete
      </button>
    </>
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