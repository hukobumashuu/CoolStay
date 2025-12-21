"use client";

import Navbar from "@/components/Navbar";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import Link from "next/link";
import HomeFooter from "@/components/HomeFooter";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import ReviewModal from "@/components/ReviewModal"; // IMPORT NEW COMPONENT

// --- TYPES ---
interface RoomType {
  id: string; // Added ID for reviews
  name: string;
  image_url: string;
}

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: string;
  room_types: RoomType | null;
}

const WelcomeContent = ({ userName }: { userName: string }) => {
  return (
    <div className="text-white space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left-10 duration-700">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg font-serif">
        Welcome back, <br /> {userName}!
      </h1>
      <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto lg:mx-0 drop-shadow-md font-medium">
        Your exclusive resort experience awaits. View your upcoming trips below.
      </p>

      <div className="flex justify-center lg:justify-start pt-4">
        <Link href="/accommodation">
          <Button
            variant="primary"
            rounded="full"
            size="lg"
            className="bg-[#0A1A44] hover:bg-[#0A1A44]/90 px-10 border border-white/20 shadow-lg"
          >
            BOOK ANOTHER STAY
          </Button>
        </Link>
      </div>
    </div>
  );
};

// --- Updated Booking Card ---
const BookingCard = ({
  booking,
  onCancel,
  onReview,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
  onReview: (booking: Booking) => void;
}) => {
  const room = booking.room_types;
  const checkIn = new Date(booking.check_in_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const checkOut = new Date(booking.check_out_date).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";
  // Allow review if completed or checked_out
  const canReview =
    booking.status === "checked_out" || booking.status === "completed";

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-xl border border-white/50 transition-transform hover:scale-[1.02]">
      <div className="w-full md:w-32 h-32 relative rounded-xl overflow-hidden shrink-0">
        <Image
          src={room?.image_url || "/images/background/coolstaybg.png"}
          alt={room?.name || "Room"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[#0A1A44] font-bold font-serif text-xl">
          {room?.name || "Standard Room"}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          Booking ID: {booking.id.slice(0, 8)}...
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="bg-blue-50 px-3 py-1 rounded-md">
            <span className="font-bold text-blue-900">IN:</span> {checkIn}
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-md">
            <span className="font-bold text-blue-900">OUT:</span> {checkOut}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            booking.status === "confirmed"
              ? "bg-green-100 text-green-700"
              : booking.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : booking.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {booking.status}
        </span>

        <div className="text-right mt-2 space-y-2 flex flex-col items-end">
          <p className="text-xl font-bold text-[#0A1A44]">
            ₱{booking.total_amount?.toLocaleString()}
          </p>

          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="text-xs text-red-500 hover:text-red-700 underline font-semibold"
            >
              Cancel Booking
            </button>
          )}

          {canReview && (
            <Button
              size="sm"
              onClick={() => onReview(booking)}
              className="bg-[#0A1A44] text-xs h-8"
            >
              Write Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });
      if (res.ok) fetchBookings();
      else alert("Failed to cancel booking.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar activePage="home" logoVariant="text" />

      {/* RENDER REVIEW MODAL */}
      {reviewBooking && user && reviewBooking.room_types && (
        <ReviewModal
          bookingId={reviewBooking.id}
          roomId={reviewBooking.room_types.id}
          roomName={reviewBooking.room_types.name}
          userId={user.id}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => alert("Review posted!")}
        />
      )}

      <div className="relative grow flex flex-col pt-20 min-h-screen">
        <div className="absolute inset-0 bg-gray-900 z-0 fixed-bg">
          <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 grow flex flex-col justify-center pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start py-12">
            <div className="space-y-10">
              <WelcomeContent
                userName={
                  user?.user_metadata?.full_name?.split(" ")[0] || "User"
                }
              />

              <div className="space-y-4">
                <h2 className="text-2xl text-white font-serif font-bold border-b border-white/20 pb-2 mb-4">
                  Your Trips
                </h2>
                {loading ? (
                  <div className="text-white/60 animate-pulse">
                    Loading your trips...
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {bookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={handleCancel}
                        onReview={(b) => setReviewBooking(b)} // Pass review handler
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                    <p className="text-blue-100 mb-2">
                      You haven&apos;t booked any trips yet.
                    </p>
                    <Link
                      href="/accommodation"
                      className="text-white font-bold underline hover:text-blue-200"
                    >
                      Browse Rooms
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex justify-end sticky top-24">
              <AvailabilityCalendar />
            </div>
          </div>
        </div>
        <HomeFooter showSignOut={true} />
      </div>
    </main>
  );
}
