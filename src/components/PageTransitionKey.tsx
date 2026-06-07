"use client";

import { usePathname } from "next/navigation";

/**
 * Forces a full React remount of all children whenever the route changes.
 * This eliminates the white/blank screen that can occur when navigating back
 * via the browser back button, since Framer Motion's `initial` animation
 * state is properly reset on every mount.
 */
export default function PageTransitionKey({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return <div key={pathname}>{children}</div>;
}
