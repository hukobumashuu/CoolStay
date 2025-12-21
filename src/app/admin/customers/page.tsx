"use client";

import { useEffect, useState } from "react";
// FIX: Removed unused 'createClient' import

// Types
interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A1A44] font-serif">
          Guest Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage registered guests and view their history
        </p>
      </div>

      {/* Main Layout: Split Screen */}
      <div className="flex gap-6 h-full overflow-hidden">
        {/* LEFT COLUMN: Guest List */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-blue-50/50 rounded-2xl animate-pulse"
              />
            ))
          ) : customers.length === 0 ? (
            <div className="text-gray-400 text-center py-10">
              No guests found.
            </div>
          ) : (
            customers.map((guest) => (
              <div
                key={guest.id}
                className={`
                  p-5 rounded-2xl transition-all duration-200 border-2
                  ${
                    selectedCustomer?.id === guest.id
                      ? "bg-white border-[#0A1A44] shadow-lg scale-[1.02]"
                      : "bg-[#E6F3FF] border-transparent hover:bg-white hover:shadow-md cursor-pointer"
                  }
                `}
                onClick={() => setSelectedCustomer(guest)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    ID: {guest.id.substring(0, 8)}...
                  </span>
                  {selectedCustomer?.id === guest.id && (
                    <span className="text-[#0A1A44] font-bold text-xs">
                      ● Active
                    </span>
                  )}
                </div>

                <h3 className="text-[#0A1A44] font-bold text-lg font-serif truncate">
                  {guest.full_name || "Guest User"}
                </h3>
                <p className="text-sm text-gray-500 truncate">{guest.email}</p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(guest);
                    }}
                    className="bg-[#0A1A44] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-900 transition-colors shadow-sm"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: Guest Details */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50 flex flex-col gap-6 overflow-y-auto">
          {selectedCustomer ? (
            <>
              {/* Header inside details */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="h-16 w-16 bg-[#0A1A44] rounded-full flex items-center justify-center text-white text-2xl font-serif">
                  {selectedCustomer.full_name?.charAt(0) || "G"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0A1A44]">
                    {selectedCustomer.full_name}
                  </h2>
                  <p className="text-gray-500">{selectedCustomer.email}</p>
                </div>
              </div>

              {/* Details Placeholders */}
              <div className="bg-[#E6F3FF]/50 p-6 rounded-3xl space-y-4">
                <h3 className="text-[#0A1A44] font-bold text-sm uppercase tracking-widest">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs">
                      Phone Number
                    </span>
                    <span className="font-medium text-gray-700">
                      {selectedCustomer.phone || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs">
                      Member Since
                    </span>
                    <span className="font-medium text-gray-700">
                      {new Date(
                        selectedCustomer.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#E6F3FF]/50 p-6 rounded-3xl flex-1 min-h-[200px]">
                <h3 className="text-[#0A1A44] font-bold text-sm uppercase tracking-widest mb-4">
                  Booking History
                </h3>
                <div className="h-32 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-blue-300 text-sm">
                  No booking records found for this guest.
                </div>
              </div>

              <div className="bg-[#E6F3FF]/50 p-6 rounded-3xl h-32">
                <h3 className="text-[#0A1A44] font-bold text-sm uppercase tracking-widest mb-2">
                  Activity Logs
                </h3>
                <p className="text-gray-400 text-xs italic">
                  System logs will appear here...
                </p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-300">
              <div className="text-6xl">👤</div>
              <p className="text-lg font-medium">
                Select a guest from the list
                <br />
                to view their profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
