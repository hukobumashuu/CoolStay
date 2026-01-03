"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { X, Loader2, User, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface RoomType {
  id: string;
  name: string;
  base_price: number;
}

interface AdminBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminBookingModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    paymentStatus: "pending", // pending vs paid
  });

  // Fetch Rooms on Open
  useEffect(() => {
    if (isOpen) {
      const fetchRooms = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("room_types")
          .select("id, name, base_price");
        if (data) setRooms(data);
      };
      fetchRooms();
      setFormData((prev) => ({
        ...prev,
        checkIn: new Date().toISOString().split("T")[0],
      })); // Default today
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Walk-in booking created successfully!");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Failed to create booking";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0A1A44] p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <User className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif">
                New Walk-in Booking
              </h2>
              <p className="text-xs text-blue-200">Book for a guest manually</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Guest Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">
              Guest Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                  value={formData.firstName}
                  // FIX: Strict Name Validation (No Numbers)
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value.replace(
                        /[^a-zA-Z\s\-\.\']/g,
                        ""
                      ),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                  value={formData.lastName}
                  // FIX: Strict Name Validation (No Numbers)
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastName: e.target.value.replace(
                        /[^a-zA-Z\s\-\.\']/g,
                        ""
                      ),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="09..."
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                  value={formData.phone}
                  // FIX: Strict Phone Validation (No Letters)
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(/[^0-9+]/g, ""),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 2: Room & Dates */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mt-2">
              Reservation Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Room
              </label>
              <select
                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                value={formData.roomId}
                onChange={(e) =>
                  setFormData({ ...formData, roomId: e.target.value })
                }
              >
                <option value="">-- Choose a Room --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} — ₱{room.base_price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check In
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                  value={formData.checkIn}
                  onChange={(e) =>
                    setFormData({ ...formData, checkIn: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check Out
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                  value={formData.checkOut}
                  onChange={(e) =>
                    setFormData({ ...formData, checkOut: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <input
                  type="number"
                  min="1" // FIX: Ensure positive numbers
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-blue-900 outline-none"
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment */}
          <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between border border-blue-100">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-blue-900">
                  Payment Status
                </p>
                <p className="text-xs text-blue-600">
                  Did the guest pay upfront?
                </p>
              </div>
            </div>
            <select
              className="p-2 border-blue-200 border rounded-lg text-sm font-bold text-blue-900 outline-none"
              value={formData.paymentStatus}
              onChange={(e) =>
                setFormData({ ...formData, paymentStatus: e.target.value })
              }
            >
              <option value="pending">Pay Later</option>
              <option value="paid">Paid (Cash/Card)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-[#0A1A44] text-white hover:bg-blue-900 px-6"
            onClick={handleSubmit}
            disabled={loading || !formData.roomId || !formData.firstName}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
