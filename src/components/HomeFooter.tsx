import Link from "next/link";

interface HomeFooterProps {
  showSignOut?: boolean;
}

export default function HomeFooter({ showSignOut = false }: HomeFooterProps) {
  return (
    <footer className="bg-[#4E342E] text-[#D7CCC8] py-4 px-8 border-t-4 border-[#3E2723] z-20 relative">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between text-sm font-serif font-semibold tracking-wide">
        {/* Left Links - Always on the left */}
        <div className="flex gap-8">
          <Link
            href="/about"
            className="hover:text-white uppercase transition-colors duration-300 hover:tracking-widest"
          >
            About Us
          </Link>
          <Link
            href="/map"
            className="hover:text-white uppercase transition-colors duration-300 hover:tracking-widest"
          >
            Resort Map
          </Link>
        </div>

        {/* Dynamic Sign Out Link - Pushed to the right */}
        {showSignOut && (
          <Link
            href="/"
            className="text-red-200 hover:text-red-50 uppercase transition-colors duration-300 hover:tracking-widest"
          >
            Sign Out
          </Link>
        )}
      </div>
    </footer>
  );
}
