"use client";

import React from "react";

// Mock Data
const staffList = [
  { id: "S12345", username: "Username" },
  { id: "S12346", username: "JaneDoe" },
  { id: "S12347", username: "JohnSmith" },
];

export default function StaffManagementPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6">
      {/* -m-6 and p-8 are used to override the default padding from AdminLayout if needed to fill full background */}

      <h1 className="text-4xl font-serif font-bold text-black mb-10">
        Staff Profile
      </h1>

      <div className="w-full max-w-5xl space-y-6">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="flex flex-col sm:flex-row items-center justify-between bg-[#a3cbf5] rounded-full px-8 py-5 shadow-sm w-full gap-4 sm:gap-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-16 text-black font-semibold text-lg w-full sm:w-auto text-center sm:text-left">
              <div>
                <span className="font-bold">ID Number: </span> {staff.id}
              </div>
              <div>
                <span className="font-bold">Username: </span> {staff.username}
              </div>
            </div>

            <button className="bg-[#0f2452] hover:bg-[#1a3a75] text-white px-10 py-2 rounded-lg font-bold tracking-wide transition-colors shadow-md">
              VIEW
            </button>
          </div>
        ))}

        {/* Empty Placeholder slots to match design feel */}
        <div className="h-20 bg-[#a3cbf5] rounded-full w-full opacity-50 border-2 border-dashed border-slate-400/30"></div>
        <div className="h-20 bg-[#a3cbf5] rounded-full w-full opacity-50 border-2 border-dashed border-slate-400/30"></div>
      </div>
    </div>
  );
}
