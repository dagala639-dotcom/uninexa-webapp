import Link from "next/link";

export default function MobileNav() {
  const links = [
    ["Home", "/dashboard"],
    ["Profile", "/dashboard/profile"],
    ["Apps", "/dashboard/applications"],
    ["Docs", "/dashboard/documents"],
    ["More", "/dashboard/settings"],
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#050816]/95 px-3 py-3 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {links.map(([name, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl px-2 py-2 text-center text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white"
          >
            {name}
          </Link>
        ))}
      </div>
    </nav>
  );
}