"use client";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
export default function DashboardHeader({ setOpen }) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between">
      {" "}
      <div className="flex items-center gap-3">
        {" "}
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-white/5 md:hidden"
        >
          {" "}
          <Menu size={22} />{" "}
        </button>{" "}
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {" "}
          Dashboard{" "}
        </h1>{" "}
      </div>{" "}
      <div className="flex items-center gap-3">
        {" "}
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover border border-amber-400/30"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
            {" "}
            {user?.name?.charAt(0) || "U"}{" "}
          </div>
        )}{" "}
        <div className="hidden text-right sm:block">
          {" "}
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {" "}
            {user?.name || "User"}{" "}
          </p>{" "}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {" "}
            {user?.email}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}
