"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Home,
  FileText,
  Globe2,
  Trophy,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Apps",
    href: "/dashboard/applications",
    icon: FileText,
  },
  {
    name: "Schools",
    href: "/dashboard/universities",
    icon: Globe2,
  },
  {
    name: "Funding",
    href: "/dashboard/scholarships",
    icon: Trophy,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#070B14]/95 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[60px] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition ${
                isActive
                  ? "bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-blue-500/20 text-white"
                  : "text-white/45 hover:text-white"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                  isActive
                    ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-fuchsia-500/20"
                    : "bg-white/5"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span className="text-[11px] font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}