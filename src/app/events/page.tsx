import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#CBE4F9]">
      {/* 1. Navbar: Active "events", Text Logo */}
      <Navbar activePage="events" logoVariant="text" />

      <div className="pt-28 pb-20 px-4 sm:px-8 max-w-[1200px] mx-auto space-y-8">
        {/* 2. Header Card (Blue Banner) */}
        <div className="relative bg-[#0077B6] rounded-3xl p-8 shadow-xl text-white text-center mt-12">
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

          <h1 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mt-8">
            Plan An Event
          </h1>
        </div>

        {/* 3. Main Content Card */}
        <div className="bg-[#90C8EF] border-2 border-[#0077B6] rounded-3xl p-8 md:p-12 shadow-md text-[#0A1A44]">
          {/* Intro Section */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
              Unforgettable Experiences: Discover Captivating Events
            </h2>
            <p className="text-sm md:text-base font-medium leading-relaxed">
              Enjoy seamless execution, where unforgettable experiences await
              across a diverse range of captivating events. Whether you&#39;re
              seeking a breathtaking wedding venue, a corporate retreat that
              inspires productivity, a family reunion immersed in nature&#39;s
              beauty, or a thrilling adventure for a group of friends, we have
              the perfect setting and expertise to give you cherished memories
              that will last a lifetime.
            </p>
          </div>

          {/* Feature Section: Meetings & Conferences */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Text & Button */}
            <div className="space-y-6">
              {/* CTA Button */}
              <div className="mb-8">
                <Button className="bg-[#0A1A44] hover:bg-[#0A1A44]/90 text-white rounded-lg px-8 py-3 text-sm font-bold uppercase tracking-wider shadow-lg">
                  Request for Proposal
                </Button>
              </div>

              <h3 className="text-3xl font-bold text-white drop-shadow-md">
                Meetings & Conferences
              </h3>

              <div className="space-y-4 text-sm font-medium text-slate-800">
                <p>
                  Whether you prefer the convenience of being in close proximity
                  to Manila or desire a destination getaway that feels worlds
                  apart from the metro, from small social functions to large
                  corporate events, CoolWaves offers a variety of well-equipped
                  venues to suit your needs.
                </p>
                <p>
                  Our dedicated team will assist you in planning every detail to
                  ensure a successful and productive gathering.
                </p>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden border-4 border-white/30 shadow-lg">
              {/* Placeholder for the conference room image */}
              <Image
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop"
                alt="Meetings and Conferences Hall"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
