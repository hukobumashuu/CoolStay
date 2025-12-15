import { Button } from "@/components/ui/Button";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import HomeFooter from "./HomeFooter";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Background Area */}
      <section className="relative grow flex items-center justify-center pt-20 pb-16">
        {/* Background Image Placeholder - Replace with actual image */}
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-8 grid lg:grid-cols-2 gap-12 items-center mt-10">
          {/* Left Side: Title & CTA */}
          <div className="text-white space-y-6 text-center lg:text-left">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight drop-shadow-lg font-serif">
              CoolStay
            </h1>
            <div className="flex justify-center lg:justify-start">
              <Button
                variant="primary"
                rounded="full"
                size="lg"
                className="bg-[#0A1A44] hover:bg-[#0A1A44]/90 px-10 border border-white/20"
              >
                Explore Now
              </Button>
            </div>
          </div>

          {/* Right Side: Calendar */}
          <div className="flex justify-center lg:justify-end">
            <AvailabilityCalendar />
          </div>
        </div>
      </section>

      {/* Brown Footer Strip (As seen in image) */}
      <HomeFooter />
    </div>
  );
}
