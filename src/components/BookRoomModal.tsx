"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthButton } from "@/components/auth/AuthButton";
import { useRouter } from "next/navigation";

// Define BookingData interface
export interface BookingData {
  id: string;
  name: string;
  base_price: number;
}

interface BookRoomModalProps {
  room: BookingData;
  onClose: () => void;
}

export default function BookRoomModal({ room, onClose }: BookRoomModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);

  // --- Derived State for Price ---
  let nights = 0;
  let totalPrice = 0;

  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      nights = diffDays;
      totalPrice = diffDays * room.base_price;
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. Check if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to book a room.");
      router.push("/login");
      return;
    }

    try {
      // 2. AVAILABILITY CHECK (Double Booking Protection)
      const { data: roomType, error: roomError } = await supabase
        .from("room_types")
        .select("total_rooms")
        .eq("id", room.id)
        .single();

      if (roomError) throw new Error("Could not fetch room details.");

      // Count overlapping bookings
      const { count, error: countError } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("room_type_id", room.id)
        .neq("status", "cancelled")
        .lte("check_in_date", checkOut)
        .gte("check_out_date", checkIn);

      if (countError) throw countError;

      const totalRooms = roomType?.total_rooms || 1;
      const existingBookings = count || 0;

      if (existingBookings >= totalRooms) {
        throw new Error(
          `Sorry, we are fully booked for these dates! (Only ${totalRooms} rooms available)`
        );
      }

      // 3. Insert Booking
      const { error: insertError } = await supabase.from("bookings").insert({
        guest_id: user.id,
        room_type_id: room.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        guests_count: guests,
        total_amount: totalPrice,
        status: "pending",
        payment_status: "pending",
      });

      if (insertError) throw insertError;

      // Success
      alert("Booking Request Sent! View it on your dashboard.");
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      // <--- FIXED TYPE
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-serif font-bold text-[#0A1A44] mb-2">
          Book {room.name}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Complete your details to reserve this room.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Check-in
              </label>
              <input
                type="date"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Check-out
              </label>
              <input
                type="date"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Guests
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={guests || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setGuests(isNaN(val) ? 0 : val);
              }}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl space-y-2 mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Rate per night</span>
              <span>₱ {room.base_price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Nights</span>
              <span>{nights}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-[#0A1A44] text-lg">
              <span>Total</span>
              <span>₱ {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2">
            <AuthButton type="submit" disabled={loading || totalPrice <= 0}>
              {loading ? "Checking Availability..." : "Confirm Booking"}
            </AuthButton>
          </div>
        </form>
      </div>
    </div>
  );
}
