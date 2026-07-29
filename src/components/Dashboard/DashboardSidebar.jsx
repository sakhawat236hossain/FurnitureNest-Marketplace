"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  X,
} from "lucide-react";
const menu = [
  { name: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];
export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();
  return (
    <>
      {" "}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}{" "}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 transition-transform duration-300 md:static md:translate-x-0 md:flex md:flex-col ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {" "}
        <div className="mb-4 flex items-center justify-between md:hidden">
          {" "}
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {" "}
            Menu{" "}
          </span>{" "}
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            {" "}
            <X size={20} />{" "}
          </button>{" "}
        </div>{" "}
        <Link href="/" className="mb-8 flex items-center gap-3">
          {" "}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-white shadow-lg">
            {" "}
            F{" "}
          </div>{" "}
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {" "}
            FurnishNest{" "}
          </span>{" "}
        </Link>{" "}
        <nav className="flex-1 space-y-2">
          {" "}
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${active ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-700 dark:text-gray-200 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-white/5 dark:hover:text-amber-300"}`}
              >
                {" "}
                <Icon size={20} /> {item.name}{" "}
              </Link>
            );
          })}{" "}
        </nav>{" "}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
        >
          {" "}
          <LogOut size={20} /> Logout{" "}
        </button>{" "}
      </aside>{" "}
    </>
  );
}
