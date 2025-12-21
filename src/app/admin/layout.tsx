import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans text-gray-800">
      {/* 1. Fixed Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Wrapper */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* 3. Top Navbar */}
        <AdminNavbar />

        {/* 4. Page Content */}
        <main className="flex-1 p-6 mt-16 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
