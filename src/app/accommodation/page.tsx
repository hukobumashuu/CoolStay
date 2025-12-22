"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import RoomCard, { BookingData } from "@/components/Roomcard";
import BookRoomModal from "@/components/BookRoomModal";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, Suspense } from "react"; // Added Suspense
import { toast } from "sonner";
import { Loader2, Search, Users } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface RoomType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  amenities: string[];
  base_price: number;
  total_rooms: number;
}

// 1. Rename the main logic component (Not default export anymore)
function AccommodationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Search State
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState<number | string>(2);

  // Selected room for Modal
  const [selectedRoom, setSelectedRoom] = useState<BookingData | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchRooms();

      const returnRoomId = searchParams.get("room_id");
      const returnCheckIn = searchParams.get("check_in");
      const returnCheckOut = searchParams.get("check_out");
      const returnGuests = searchParams.get("guests");

      if (returnCheckIn) setCheckInDate(returnCheckIn);
      if (returnCheckOut) setCheckOutDate(returnCheckOut);
      if (returnGuests) setGuestCount(parseInt(returnGuests));
    };

    const fetchRoomsData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("room_types")
        .select("*")
        .eq("is_active", true);
      return data as RoomType[] | null;
    };

    const run = async () => {
      const data = await fetchRoomsData();
      if (data) {
        setRooms(data);

        const returnRoomId = searchParams.get("room_id");
        if (returnRoomId) {
          const roomToOpen = data.find((r) => r.id === returnRoomId);
          if (roomToOpen) {
            setSelectedRoom({
              id: roomToOpen.id,
              name: roomToOpen.name,
              base_price: roomToOpen.base_price,
            });
            router.replace("/accommodation", { scroll: false });
          }
        }
      }
      setLoading(false);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRooms = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("room_types")
      .select("*")
      .eq("is_active", true);

    if (error) {
      toast.error("Failed to load rooms");
    } else {
      setRooms(data as RoomType[]);
    }
  };

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setSearching(true);
    const supabase = createClient();
    const validGuestCount = Number(guestCount) || 1;

    try {
      const { data: allRooms, error: roomsError } = await supabase
        .from("room_types")
        .select("*")
        .eq("is_active", true)
        .gte("capacity", validGuestCount);

      if (roomsError) throw roomsError;

      const { data: busyBookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("room_type_id")
        .neq("status", "cancelled")
        .lt("check_in_date", checkOutDate)
        .gt("check_out_date", checkInDate);

      if (bookingsError) throw bookingsError;

      const bookingCounts: Record<string, number> = {};

      busyBookings?.forEach((booking) => {
        const id = booking.room_type_id;
        bookingCounts[id] = (bookingCounts[id] || 0) + 1;
      });

      const availableRooms = (allRooms as RoomType[]).filter((room) => {
        const bookedCount = bookingCounts[room.id] || 0;
        return room.total_rooms > bookedCount;
      });

      setRooms(availableRooms);

      if (availableRooms.length === 0) {
        toast.info("No rooms available for these dates.");
      } else {
        toast.success(`Found ${availableRooms.length} available rooms!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while searching.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#D6EAF8]">
      <Navbar activePage="accommodation" logoVariant="text" />

      {selectedRoom && (
        <BookRoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialGuests={Number(guestCount) || 2}
        />
      )}

      <div className="pt-28 pb-20 px-4 sm:px-8 max-w-[1440px] mx-auto">
        {/* Search Bar Section */}
        <div className="relative bg-[#0077B6] rounded-3xl p-6 md:p-8 shadow-xl text-white mb-12 mt-8 animate-in slide-in-from-top-10 duration-700">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden z-10">
            <Image
              src="/images/logo/coolstaylogo.jpg"
              alt="CoolStay logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-5 space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider opacity-90">
                <span>Check In & Out</span>
              </div>
              <div className="bg-white text-gray-700 rounded-xl flex items-center h-14 px-2 shadow-inner overflow-hidden">
                <div className="flex-1 px-2 border-r border-gray-100">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">
                    From
                  </span>
                  <input
                    type="date"
                    className="w-full outline-none text-sm font-bold text-[#0A1A44]"
                    value={checkInDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
                <div className="flex-1 px-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">
                    To
                  </span>
                  <input
                    type="date"
                    className="w-full outline-none text-sm font-bold text-[#0A1A44]"
                    value={checkOutDate}
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Guests
              </span>
              <div className="bg-white text-gray-700 rounded-xl h-14 flex items-center px-4 shadow-inner relative">
                <Users className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="w-full outline-none font-bold text-[#0A1A44] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={guestCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setGuestCount("");
                    } else {
                      const num = parseInt(val);
                      if (!isNaN(num)) setGuestCount(num);
                    }
                  }}
                />
                <span className="absolute right-4 text-xs font-bold text-gray-400 pointer-events-none">
                  PAX
                </span>
              </div>
            </div>

            <div className="md:col-span-3">
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="w-full h-14 bg-[#0A1A44] hover:bg-[#0A1A44]/90 rounded-xl shadow-lg text-lg font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95"
              >
                {searching ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" /> Check Availability
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Room List */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#0A1A44] mx-auto mb-4" />
              <p className="text-[#0A1A44]/60 font-medium">
                Finding the perfect room for you...
              </p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-[#0077B6]/30">
              <p className="text-xl text-[#0A1A44] font-bold">No rooms found</p>
              <p className="text--[#0A1A44]/60 mt-2">
                Try changing your dates or guest count.
              </p>
              <Button
                onClick={fetchRooms}
                variant="outline"
                className="mt-4 border-[#0A1A44] text-[#0A1A44] hover:bg-[#0A1A44] hover:text-white"
              >
                View All Rooms
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-6 px-2">
                <h2 className="text-2xl font-serif font-bold text-[#0A1A44]">
                  {checkInDate && checkOutDate
                    ? "Available Rooms"
                    : "All Accommodations"}
                </h2>
                <span className="text-sm font-bold text-[#0077B6] bg-white px-3 py-1 rounded-full shadow-sm">
                  {rooms.length} Results
                </span>
              </div>
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  title={room.name}
                  description={room.description}
                  imageSrc={
                    room.image_url || "/images/background/coolstaybg.png"
                  }
                  size={room.amenities?.[0] || "Standard"}
                  features={room.amenities || []}
                  price={room.base_price}
                  onBook={(roomData) => setSelectedRoom(roomData)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

// 2. Create the default export wrapped in Suspense
export default function AccommodationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#D6EAF8] pt-28 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#0A1A44]" />
        </div>
      }
    >
      <AccommodationContent />
    </Suspense>
  );
}
