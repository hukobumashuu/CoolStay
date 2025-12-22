"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthButton } from "@/components/auth/AuthButton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface BookingData {
  id: string;
  name: string;
  base_price: number;
}

interface BookRoomModalProps {
  room: BookingData;
  onClose: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export default function BookRoomModal({
  room,
  onClose,
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 2,
}: BookRoomModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  const [error, setError] = useState<string | null>(null);

  // Derived State for Price
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.info("Please log in to complete your booking.");
      const params = new URLSearchParams();
      params.set("room_id", room.id);
      params.set("check_in", checkIn);
      params.set("check_out", checkOut);
      params.set("guests", guests.toString());
      const returnUrl = `/accommodation?${params.toString()}`;
      router.push(`/login?return_to=${encodeURIComponent(returnUrl)}`);
      return;
    }

    try {
      // AVAILABILITY CHECK
      const { data: roomType, error: roomError } = await supabase
        .from("room_types")
        .select("total_rooms")
        .eq("id", room.id)
        .single();

      if (roomError) throw new Error("Could not fetch room details.");

      const { count, error: countError } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("room_type_id", room.id)
        .neq("status", "cancelled")
        .lt("check_in_date", checkOut)
        .gt("check_out_date", checkIn);

      if (countError) throw countError;

      const totalRooms = roomType?.total_rooms || 1;
      const existingBookings = count || 0;

      if (existingBookings >= totalRooms) {
        throw new Error(
          `Sorry, we are fully booked for these dates! (Only ${totalRooms} rooms available)`
        );
      }

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

      toast.success("Booking Request Sent! View it on your dashboard.");
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper for input styles - INCREASED CONTRAST
  const inputClass =
    "w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none text-slate-900 font-medium placeholder:text-slate-400";
  const labelClass =
    "text-xs font-bold text-[#0A1A44] uppercase tracking-wider mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2"
        >
          ✕
        </button>

        <h2 className="text-2xl font-serif font-bold text-[#0A1A44] mb-2">
          Book {room.name}
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          Complete your details to reserve this room.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Check-in</label>
              <input
                type="date"
                required
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Check-out</label>
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                className={inputClass}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Guests</label>
            <input
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setGuests(isNaN(val) ? 1 : val);
              }}
              className={inputClass}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2 mt-4 border border-slate-200">
            <div className="flex justify-between text-sm text-slate-600 font-medium">
              <span>Rate per night</span>
              <span>₱ {room.base_price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 font-medium">
              <span>Nights</span>
              <span>{nights > 0 ? nights : 0}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 mt-1 flex justify-between font-bold text-[#0A1A44] text-lg">
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
