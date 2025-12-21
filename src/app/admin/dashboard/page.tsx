"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

// --- TYPES ---
interface UserProfile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface RoomType {
  name: string;
}

interface Booking {
  id: string;
  created_at: string;
  status: string;
  guests_count: number;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  payment_status: string;
  users: UserProfile | null; // Joined user data
  room_types: RoomType | null; // Joined room data
}

// Mock Tabs
const TABS = [
  "View All Booking",
  "Payment & Transaction Status",
  "Modification",
  "Cancellation",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("View All Booking");
  // FIX: Replaced 'any[]' with 'Booking[]'
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          users (full_name, email, phone),
          room_types (name)
        `
        )
        .order("created_at", { ascending: false });

      if (data) {
        // Cast the data to our Booking type safely
        setBookings(data as unknown as Booking[]);
      }
      if (error) console.error(error);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1A44]">Manage Bookings</h1>
          <p className="text-gray-500 text-sm">
            Overview of all guest reservations
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#0A1A44] text-white hover:bg-blue-900 text-sm px-4 py-2 rounded-lg shadow-sm">
            + New Booking
          </Button>
        </div>
      </div>

      {/* 2. Horizontal Action Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-blue-100 pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-t-lg text-sm font-bold transition-all ${
              activeTab === tab
                ? // FIX: Changed translate-y-[1px] to translate-y-px
                  "bg-white text-[#0A1A44] border-x border-t border-blue-100 shadow-sm translate-y-px"
                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Booking Info Cards (Grid Layout) */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-blue-100 text-gray-400">
            No bookings found.
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
            >
              {/* Header inside Card */}
              <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-lg">
                    🏨
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A1A44]">
                      {booking.room_types?.name || "Room"}
                    </h3>
                    <span className="text-xs text-gray-400">
                      ID: {booking.id.slice(0, 8)}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "pending"
                      ? "bg-gray-100 text-gray-600"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoField
                  label="Guest Name"
                  value={booking.users?.full_name || "Guest"}
                />
                <InfoField
                  label="Phone Number"
                  value={booking.users?.phone || "N/A"}
                />
                <InfoField
                  label="Email Address"
                  value={booking.users?.email || "N/A"}
                />
                <InfoField
                  label="Guests"
                  value={`${booking.guests_count} Person(s)`}
                />

                <InfoField
                  label="Check-in Date"
                  value={new Date(booking.check_in_date).toDateString()}
                />
                <InfoField
                  label="Check-out Date"
                  value={new Date(booking.check_out_date).toDateString()}
                />
                <InfoField
                  label="Total Price"
                  value={`₱${booking.total_amount?.toLocaleString()}`}
                  highlight
                />
                <InfoField
                  label="Payment Status"
                  value={booking.payment_status}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Large Empty Panel (For future logs) */}
      <div className="bg-white rounded-3xl p-8 border border-blue-100 min-h-[300px] flex items-center justify-center text-gray-300 font-medium border-dashed">
        Additional Logs / Tables Area
      </div>
    </div>
  );
}

// Helper Component for the Grid Fields
function InfoField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#F8FBFF] p-3 rounded-xl border border-blue-50/50">
      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
        {label}
      </p>
      <p
        className={`font-medium text-sm truncate ${
          highlight ? "text-[#0A1A44] font-bold" : "text-gray-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
