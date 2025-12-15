import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-[#CBE4F9]">
      {/* 1. Navbar: Active "experience", Text Logo */}
      <Navbar activePage="experience" logoVariant="text" />

      <div className="pt-28 pb-20 px-4 sm:px-8 max-w-[1200px] mx-auto space-y-8">
        {/* 2. Header Card with Sub-Navigation */}
        <div className="relative bg-[#0077B6] rounded-3xl pt-16 pb-8 px-8 shadow-xl text-white text-center mt-12">
          {/* Floating Logo Icon */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden z-10">
            <Image
              src="/coolstaylogo.jpg"
              alt="CoolStay logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Sub-Navigation Menu */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm md:text-base font-medium tracking-wide mt-4">
            <button className="relative pb-2 border-b-2 border-white text-white">
              Water Activity
            </button>
            <button className="relative pb-2 border-b-2 border-transparent hover:border-white/50 text-blue-100 hover:text-white transition-all">
              Restaurant Dining
            </button>
            <button className="relative pb-2 border-b-2 border-transparent hover:border-white/50 text-blue-100 hover:text-white transition-all">
              Spa
            </button>
            <button className="relative pb-2 border-b-2 border-transparent text-blue-200 cursor-default">
              Coming soon...
            </button>
          </div>
        </div>

        {/* 3. Content: Helmet Diving */}
        <div className="bg-[#90C8EF] rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row gap-8 items-center border-2 border-[#0077B6]">
          {/* Left: Image */}
          <div className="w-full md:w-1/3 relative h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
            <Image
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
              alt="Helmet Diving"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Text */}
          <div className="flex-1 text-[#0A1A44] space-y-4">
            <h2 className="text-3xl font-serif font-bold uppercase tracking-wider">
              Helmet Diving
            </h2>
            <div className="space-y-4 text-sm md:text-base font-medium leading-relaxed opacity-90">
              <p>
                Dive into an unforgettable experience with our Helmet Diving
                adventure, where you can explore life 12 feet beneath the
                surface! This activity is perfect for the entire family.
              </p>
              <p>
                No need for advanced diving skills—if you can walk and breathe,
                you&lsquo;re all set! It&lsquo;s that simple.
              </p>
              <p>
                Helmet diving is a perfect basic step for those eyeing scuba
                diving and other underwater activities in the future.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Content: Wave Pool */}
        <div className="bg-[#90C8EF] rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row gap-8 items-center border-2 border-[#0077B6]">
          {/* Left: Image */}
          <div className="w-full md:w-1/3 relative h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
            <Image
              src="https://images.unsplash.com/photo-1572331165267-854da2b00cc3?q=80&w=2070&auto=format&fit=crop"
              alt="Wave Pool"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Text */}
          <div className="flex-1 text-[#0A1A44] space-y-4">
            <h2 className="text-3xl font-serif font-bold uppercase tracking-wider">
              Wave Pool & Raging River
            </h2>
            <div className="space-y-4 text-sm md:text-base font-medium leading-relaxed opacity-90">
              <p>
                Experience the thrill of the ocean right here at CoolStay. Our
                signature Wave Pool generates distinct wave patterns, from
                gentle rollers to exciting diamond waves, simulating a true
                beach vibe.
              </p>
              <p>
                Looking for relaxation? Grab a floater and let the current take
                you away on our Raging River, winding through the scenic
                landscape of the resort.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
