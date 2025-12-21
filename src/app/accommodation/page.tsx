"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import RoomCard, { BookingData } from "@/components/Roomcard"; // Import type
import BookRoomModal from "@/components/BookRoomModal";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

// Types matching your DB
interface RoomType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  amenities: string[];
  base_price: number;
}

export default function AccommodationPage() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  // Use the correct type here so TS knows what 'selectedRoom' contains
  const [selectedRoom, setSelectedRoom] = useState<BookingData | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("room_types")
        .select("*")
        .eq("is_active", true);

      if (data) setRooms(data as RoomType[]);
    };

    fetchRooms();
  }, []);

  return (
    <main className="min-h-screen bg-[#D6EAF8]">
      <Navbar activePage="accommodation" logoVariant="text" />

      {/* SHOW MODAL IF ROOM IS SELECTED */}
      {selectedRoom && (
        <BookRoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      <div className="pt-28 pb-20 px-4 sm:px-8 max-w-[1440px] mx-auto">
        {/* --- SEARCH BAR VISUAL --- */}
        <div className="relative bg-[#0077B6] rounded-3xl p-6 md:p-8 shadow-xl text-white mb-8 mt-8">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden z-10">
            <Image
              src="/images/logo/coolstaylogo.jpg"
              alt="CoolStay logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-6">
            {/* Check in / Check out Visuals */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                <span>Check in</span>
                <span>Check out</span>
              </div>
              <div className="bg-white text-gray-700 rounded-md flex items-center h-12 px-4 shadow-inner">
                <div className="flex-1 flex items-center gap-2 cursor-pointer">
                  <span className="text-sm">Select Date</span>
                </div>
                <span className="text-gray-400 mx-2">→</span>
                <div className="flex-1 flex items-center gap-2 cursor-pointer">
                  <span className="text-sm">Select Date</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Number of Guests
              </span>
              <div className="bg-white text-gray-700 rounded-md h-12 flex items-center px-4 justify-between shadow-inner cursor-pointer">
                <span className="text-sm">2 Adults, 1 Child</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <Button className="w-full h-12 bg-[#0A1A44] hover:bg-[#0A1A44]/90 rounded-xl shadow-lg">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* --- ROOM LIST --- */}
        <div className="space-y-8">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              title={room.name}
              description={room.description}
              imageSrc={room.image_url || "/images/background/coolstaybg.png"}
              size={room.amenities?.[0] || "Standard"}
              features={room.amenities || []}
              price={room.base_price}
              onBook={(roomData) => setSelectedRoom(roomData)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
