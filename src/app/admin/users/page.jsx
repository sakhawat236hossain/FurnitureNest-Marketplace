"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Filter,
  Shield,
  Trash2,
  CheckCircle,
  UserCheck,
  Store,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/users?role=${roleFilter}&q=${search}`,
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const res = await axios.patch("/api/admin/users", {
        userId,
        role: newRole,
      });

      if (res.data.success) {
        toast.success(`Role updated successfully to ${newRole.toUpperCase()}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update user role",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await axios.delete(`/api/admin/users?userId=${userId}`);
      if (res.data.success) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const handleMarkFraud = async (userId, isFraud) => {
    try {
      setUpdatingId(userId);
      const res = await axios.patch("/api/admin/users", {
        userId,
        isFraud,
      });

      if (res.data.success) {
        toast.success(
          isFraud ? "Vendor marked as fraud" : "Vendor unmarked as fraud",
        );
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isFraud } : u)),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update fraud status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="text-amber-500" size={32} />
            User & Vendor Role Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View users, promote Users to Vendor/Admin, or manage permissions
            instantly.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4 shadow-sm">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-amber-400 transition"
          />
        </form>

        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {["all", "user", "seller", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold capitalize transition ${
                roleFilter === role
                  ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {role === "seller" ? "Vendor / Seller" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            No users found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="pb-4">User Details</th>
                  <th className="pb-4">Contact</th>
                  <th className="pb-4">Current Role</th>
                  <th className="pb-4">Change Access Role</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    {/* User info */}
                    <td className="py-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-amber-400/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <span className="text-xs text-gray-400 capitalize">
                            Provider: {user.provider || "Credentials"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 text-gray-600 dark:text-gray-300">
                      <p>{user.email}</p>
                      <p className="text-xs text-gray-400">
                        {user.phone || "No phone"}
                      </p>
                    </td>

                    {/* Current Role Badge */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                            : user.role === "seller"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Shield size={14} />
                        ) : user.role === "seller" ? (
                          <Store size={14} />
                        ) : (
                          <UserIcon size={14} />
                        )}
                        {user.role === "seller"
                          ? "Vendor"
                          : user.role || "user"}
                      </span>
                    </td>

                    {/* Role Change Selector */}
                    <td className="py-4">
                      <select
                        disabled={updatingId === user._id}
                        value={user.role || "user"}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer disabled:opacity-50"
                      >
                        <option value="user">User (Customer)</option>
                        <option value="seller">Vendor / Seller</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 text-right space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-end sm:gap-2">
                      {user.role === "seller" && (
                        <button
                          onClick={() =>
                            handleMarkFraud(user._id, !user.isFraud)
                          }
                          disabled={updatingId === user._id}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                            user.isFraud
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {user.isFraud ? "Unmark Fraud" : "Mark Fraud"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
