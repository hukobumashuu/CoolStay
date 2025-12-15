import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface RoomProps {
  title: string;
  description: string;
  imageSrc: string;
  size: string;
  features: string[];
}

// FIX 1: Defined outside the main component to prevent re-creation on render
const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-1 text-yellow-400">
    {[...Array(count)].map((_, i) => (
      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function RoomCard({
  title,
  description,
  imageSrc,
  size,
  features,
}: RoomProps) {
  return (
    <div className="bg-[#A2D5F2]/20 border border-blue-200 rounded-3xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Left: Image */}
      <div className="w-full md:w-1/3 relative h-64 md:h-auto rounded-2xl overflow-hidden shrink-0">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-[#0A1A44] font-serif">
            {title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
          {/* Ratings Column */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Guest Ratings
              </p>
              <div className="flex items-center gap-2">
                <Stars /> <span className="text-xs text-gray-500">(5)</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Cleanliness
              </p>
              <Stars />
            </div>
          </div>

          {/* Comfort Column */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Room Comfort and Quality
            </p>
            <Stars />
          </div>
        </div>

        <div className="mt-auto">
          <h4 className="text-sm font-bold text-[#0A1A44] mb-2">Features:</h4>

          {/* FIX 2: Using the features prop dynamically */}
          <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700 mb-6">
            <p>Room size: {size}</p>
            {features.map((feature, index) => (
              <p key={index}>{feature}</p>
            ))}
          </div>

          <div className="flex justify-end">
            <Button className="bg-[#0A1A44] hover:bg-[#0A1A44]/90 text-white px-8 py-2 rounded-lg text-sm font-bold shadow-lg">
              BOOK NOW
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
