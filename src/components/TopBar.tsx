import Link from "next/link";
import DigitalClock from "./DigitalClock";
import NepaliCircularClock from "./NepaliCircularClock";
import HeaderSearch from "./HeaderSearch";

export default function TopBar() {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <DigitalClock />

        <div className="flex items-center gap-4">
          <HeaderSearch />
          <Link href="/manual" className="text-xs text-gray-500 hover:text-gray-800 hover:underline whitespace-nowrap">
            User Manual
          </Link>
          <NepaliCircularClock />
        </div>
      </div>
    </div>
  );
}
