"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideTopBar = pathname?.startsWith("/login");

  return (
    <>
      {!hideTopBar && <TopBar />}
      {children}
    </>
  );
}
