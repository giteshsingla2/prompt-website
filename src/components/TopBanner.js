"use client";

import { usePathname } from "next/navigation";

export default function TopBanner() {
  const pathname = usePathname();
  
  // Check if current route is the admin/login page
  const isAdmin = pathname && pathname.includes("z4q8wx-postr-92k");

  if (isAdmin) return null;

  return (
    <div className="pf-top-ad-wrapper">
      <div id="div-gpt-ad-top-banner" />
    </div>
  );
}
