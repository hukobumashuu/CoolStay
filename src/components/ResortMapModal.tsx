"use client";

import { X } from "lucide-react";

interface ResortMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResortMapModal({
  isOpen,
  onClose,
}: ResortMapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="bg-white/90 p-2 rounded-full text-slate-800 hover:bg-white hover:text-red-500 transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="w-full h-[500px] md:h-[600px] bg-slate-100 relative">
          <iframe
            width="100%"
            height="100%"
            id="gmap_canvas"
            src="https://maps.google.com/maps?q=Cool%20Waves%20Ranch%20and%20Waterpark%20Resort%20Bulacan&t=&z=15&ie=UTF8&iwloc=&output=embed"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            className="w-full h-full"
            title="CoolStay Resort Map"
          ></iframe>

          {/* Overlay to block interaction if needed (optional) */}
          <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-xl shadow-lg max-w-xs backdrop-blur-sm">
            <h3 className="font-serif font-bold text-[#0A1A44]">
              CoolStay Resort
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              777 Libo St, Brgy. San Nicolas, Bulakan, Bulacan
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Cool+Waves+Ranch+and+Waterpark+Resort+Bulacan"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-block"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
