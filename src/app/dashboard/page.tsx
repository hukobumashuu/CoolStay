import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import Link from "next/link";
import HomeFooter from "@/components/HomeFooter";

// --- Sub-Components ---

// 1. Welcome Content Component
const WelcomeContent = () => {
  return (
    <div className="text-white space-y-6 text-center lg:text-left">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg font-serif">
        Welcome to <br /> CoolStay, User!
      </h1>
      <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto lg:mx-0 drop-shadow-md font-medium">
        Experience luxurious accommodations, exciting activities, and an
        unforgettable resort experience tailored just for you.
      </p>

      {/* Primary CTA */}
      <div className="flex justify-center lg:justify-start pt-4">
        <Link href="/accommodation">
          <Button
            variant="primary"
            rounded="full"
            size="lg"
            className="bg-[#0A1A44] hover:bg-[#0A1A44]/90 px-10 border border-white/20 shadow-lg"
          >
            EXPLORE NOW
          </Button>
        </Link>
      </div>
    </div>
  );
};
// --- Main Page Component ---

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      {/* Navbar: Logged In State */}
      <Navbar isLoggedIn={true} activePage="home" logoVariant="text" />

      {/* Hero Section Container */}
      <div className="relative flex-grow flex flex-col pt-20 min-h-screen">
        {/* Background Image Layer */}
        <div className="absolute inset-0 bg-gray-900 z-0">
          <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 flex-grow flex flex-col justify-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-12">
            {/* Left: Welcome Text */}
            <WelcomeContent />

            {/* Right: Calendar Widget (Overlay) */}
            <div className="flex justify-center lg:justify-end">
              <AvailabilityCalendar />
            </div>
          </div>
        </div>

        <HomeFooter showSignOut={true} />
      </div>
    </main>
  );
}
