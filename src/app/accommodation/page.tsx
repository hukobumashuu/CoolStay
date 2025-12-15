import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import RoomCard from "@/components/Roomcard";
import Image from "next/image";

export default function AccommodationPage() {
  const rooms = [
    {
      title: "STANDARD FOR 2",
      description:
        "Experience ultimate comfort and luxury in our Deluxe Room, designed for two. Featuring a spacious layout, modern amenities, and a beautiful view, this room offers the perfect escape for you and your companion.",
      size: "18 m²/194 ft²",
      imageSrc:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "DELUXE FOR 2",
      description:
        "Step into serenity with our Standard Room. Perfectly curated for couples seeking a blend of coziness and style. Enjoy the premium bedding and ambient lighting.",
      size: "22 m²/236 ft²",
      imageSrc:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop",
    },
  ];

  return (
    <main className="min-h-screen bg-[#D6EAF8]">
      {/* 1. Navbar with Active State */}
      <Navbar activePage="accommodation" logoVariant="text" />

      <div className="pt-28 pb-20 px-4 sm:px-8 max-w-[1440px] mx-auto">
        {/* 2. Blue Search Container */}
        {/* Uses the specific blue from the image, rounded corners, drop shadow */}
        <div className="relative bg-[#0077B6] rounded-3xl p-6 md:p-8 shadow-xl text-white mb-8 mt-8">
          {/* Decorative centered logo circle (mimicking the hanging logo in design) */}
          {/* Note: Since main logo is on left, this acts as a decorative element or we can hide it if too repetitive */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden z-10">
            <Image
              src="/coolstaylogo.jpg"
              alt="CoolStay logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-6">
            {/* Check in */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                <span>Check in</span>
                <span>Check out</span>
              </div>
              <div className="bg-white text-gray-700 rounded-md flex items-center h-12 px-4 shadow-inner">
                {/* Mock Date Picker Look */}
                <div className="flex-1 flex items-center gap-2 cursor-pointer">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">date</span>
                </div>
                <span className="text-gray-400 mx-2">→</span>
                <div className="flex-1 flex items-center gap-2 cursor-pointer">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">date</span>
                </div>
              </div>
            </div>

            {/* Guest Selector */}
            <div className="md:col-span-6 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Number of Guest
              </span>
              <div className="bg-white text-gray-700 rounded-md h-12 flex items-center px-4 justify-between shadow-inner cursor-pointer">
                <span className="text-sm">2 adult</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm">1 child</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm">1 room</span>
                <span className="text-gray-400 text-lg">+</span>
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <Button className="w-full h-12 bg-[#0A1A44] hover:bg-[#0A1A44]/90 rounded-xl shadow-lg">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* 3. View Toggle (Rooms vs Package) */}
        <div className="flex justify-end mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
            <button className="px-6 py-2 text-sm font-bold text-[#0A1A44] border-b-2 border-[#0A1A44]">
              View by Rooms
            </button>
            <button className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">
              View by Package
            </button>
          </div>
        </div>

        {/* 4. Room List */}
        <div className="space-y-8">
          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              {...room}
              features={[
                "Room size: 18 m²/194 ft²",
                "Shower",
                "Air conditioning",
              ]} // Using mock features inside component for now
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
