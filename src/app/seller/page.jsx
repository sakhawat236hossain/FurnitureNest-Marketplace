import RoleGuard from "@/components/Auth/RoleGuard";
export default function SellerPage() {
  return (
    <RoleGuard role="seller">
      {" "}
      <div className="p-6">
        {" "}
        <h1 className="text-3xl font-bold text-blue-500">
          {" "}
          Seller Dashboard{" "}
        </h1>{" "}
      </div>{" "}
    </RoleGuard>
  );
}
