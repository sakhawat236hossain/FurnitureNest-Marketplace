import RoleGuard from "@/components/Auth/RoleGuard";
export default function AdminPage() {
  return (
    <RoleGuard role="admin">
      {" "}
      <div className="p-6">
        {" "}
        <h1 className="text-3xl font-bold text-red-500">
          {" "}
          Admin Dashboard{" "}
        </h1>{" "}
      </div>{" "}
    </RoleGuard>
  );
}
