"use client";
import { useEffect, useState } from "react";
export default function SellerProfilePage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);
  if (!user) return <p>Loading...</p>;
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm">
      {" "}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {" "}
        <img
          src={user.image}
          alt={user.name}
          className="h-24 w-24 rounded-full object-cover"
        />{" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {" "}
            {user.name}{" "}
          </h1>{" "}
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>{" "}
          <span className="inline-flex mt-2 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
            {" "}
            {user.role}{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
