"use client";

import React, { useEffect, useState } from "react";

// Type matches your API response structure
type StaffMember = {
  id: number;
  employee_id: string;
  full_name: string;
  position: string;
  department: string;
};

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/admin/staff");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStaffList(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6">
      <h1 className="text-4xl font-serif font-bold text-black mb-10">
        Staff Profile
      </h1>

      <div className="w-full max-w-5xl space-y-6">
        {isLoading ? (
          <div className="text-slate-500 font-medium animate-pulse">
            Loading staff records...
          </div>
        ) : (
          staffList.map((staff) => (
            <div
              key={staff.id}
              className="flex flex-col sm:flex-row items-center justify-between bg-[#a3cbf5] rounded-full px-8 py-5 shadow-sm w-full gap-4 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 text-black font-semibold text-lg w-full sm:w-auto text-center sm:text-left">
                <div className="w-32">
                  <span className="block text-xs uppercase opacity-60 font-bold">
                    ID Number
                  </span>
                  <span>{staff.employee_id}</span>
                </div>
                <div className="w-48">
                  <span className="block text-xs uppercase opacity-60 font-bold">
                    Name
                  </span>
                  <span>{staff.full_name}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase opacity-60 font-bold">
                    Role
                  </span>
                  <span className="text-sm bg-[#0f2452] text-white px-3 py-0.5 rounded-full">
                    {staff.position}
                  </span>
                </div>
              </div>

              <button className="bg-[#0f2452] hover:bg-[#1a3a75] text-white px-10 py-2 rounded-lg font-bold tracking-wide transition-colors shadow-md">
                VIEW
              </button>
            </div>
          ))
        )}

        {/* Placeholder for empty state if needed */}
        {!isLoading && staffList.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No staff members found.
          </div>
        )}
      </div>
    </div>
  );
}
