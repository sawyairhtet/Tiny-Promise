"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Today" },
  { href: "/history", label: "History" },
  { href: "/insights", label: "Insights" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-warm-200 z-50">
      <div className="max-w-[640px] mx-auto flex">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`flex-1 py-5 text-center text-sm transition-colors focus-visible:outline-none focus-visible:text-sage-600 ${
                isActive
                  ? "text-sage-600 font-semibold"
                  : "text-warm-400 hover:text-warm-600"
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="block mx-auto mt-1 h-1 w-1 rounded-full bg-sage-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
