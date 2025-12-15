import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="bg-[#4E342E] text-[#D7CCC8] py-4 px-8 border-t-4 border-[#3E2723]">
      <div className="max-w-[1440px] mx-auto flex gap-8 text-sm font-serif font-semibold tracking-wide">
        <Link
          href="/about"
          className="hover:text-white uppercase transition-colors"
        >
          About Us
        </Link>
        <Link
          href="/map"
          className="hover:text-white uppercase transition-colors"
        >
          Resort Map
        </Link>
      </div>
    </footer>
  );
}
