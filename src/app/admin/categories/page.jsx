"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    status: "active",
    featured: false,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/categories");
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      status: "active",
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      status: cat.status || "active",
      featured: Boolean(cat.featured),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        // Edit Mode
        const res = await axios.put("/api/admin/categories", {
          id: editingCategory._id,
          ...formData,
        });
        if (res.data.success) {
          toast.success("Category updated successfully!");
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        // Create Mode
        const res = await axios.post("/api/admin/categories", formData);
        if (res.data.success) {
          toast.success("Category created successfully!");
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to save category."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catId, catName) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    try {
      const res = await axios.delete(`/api/admin/categories?id=${catId}`);
      if (res.data.success) {
        toast.success("Category deleted successfully.");
        setCategories((prev) => prev.filter((c) => c._id !== catId));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category.");
    }
  };

  const handleToggleFeatured = async (cat) => {
    try {
      const updatedFeatured = !cat.featured;
      const res = await axios.put("/api/admin/categories", {
        id: cat._id,
        featured: updatedFeatured,
      });
      if (res.data.success) {
        toast.success(
          updatedFeatured
            ? `"${cat.name}" marked as featured.`
            : `"${cat.name}" removed from featured.`
        );
        setCategories((prev) =>
          prev.map((c) =>
            c._id === cat._id ? { ...c, featured: updatedFeatured } : c
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;
  const featuredCategories = categories.filter((c) => c.featured).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-200/80 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-8 sm:p-10 shadow-xl shadow-orange-500/5 dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-4 py-1 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-400/20">
              <FolderTree className="h-4 w-4" /> Admin Catalog Management
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Furniture Categories
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Manage marketplace furniture categories, set icons, featured badges, and monitor live product inventory counts.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 hover:from-amber-600 hover:to-orange-600"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 border-t border-amber-200/60 dark:border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Categories</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalCategories}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Status</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{activeCategories}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Featured Categories</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{featuredCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category by name or description..."
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20"
          />
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-amber-500" />
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Living Room, Executive Desks"
                  className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Banner Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 h-24 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief summary of items in this category..."
                  className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-amber-400"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft / Hidden</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featured: e.target.checked,
                        })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-amber-500" /> Featured
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 dark:border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Categories */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 text-amber-500 font-semibold">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading categories...
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-12 text-center shadow-sm">
          <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            No categories found.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Click "Add New Category" to create your first category.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Card Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={cat.image || "/placeholder.png"}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-md ${
                      cat.status === "active"
                        ? "bg-emerald-500/90"
                        : "bg-gray-500/90"
                    }`}
                  >
                    {cat.status === "active" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {cat.status}
                  </span>

                  {cat.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                      <Sparkles className="h-3.5 w-3.5" /> Featured
                    </span>
                  )}
                </div>

                {/* Live Product Count Badge */}
                <div className="absolute bottom-3 right-3 rounded-full bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                  <Package className="h-3.5 w-3.5 text-amber-400" />
                  <span>{cat.productCount ?? 0} Items</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {cat.description || "No description provided."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      title="Edit Category"
                      className="flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:border-amber-400 hover:text-amber-500 transition"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(cat)}
                      title={cat.featured ? "Unfeature Category" : "Feature Category"}
                      className={`flex items-center justify-center h-9 w-9 rounded-xl border transition ${
                        cat.featured
                          ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                          : "border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-gray-400 hover:text-amber-500"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      title="Delete Category"
                      className="flex items-center justify-center h-9 w-9 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <Link
                    href={`/categories?category=${encodeURIComponent(cat.slug || cat.name.toLowerCase())}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <span>View Live</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
