"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function RoleGuard({ role, children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== role) {
      router.replace("/");
    }
  }, [session, status, role, router]);
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {" "}
        Loading...{" "}
      </div>
    );
  }
  return children;
}
