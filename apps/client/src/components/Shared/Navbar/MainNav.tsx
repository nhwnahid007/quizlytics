import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const MainNav = () => {
  const pathname = usePathname();

  return (
    <div className="hidden items-center lg:flex">
      <nav className="flex items-center gap-2" aria-label="Main navigation">
        {navItems.map(item => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "bg-primary-color/10 text-primary-color"
                  : "text-foreground hover:bg-muted hover:text-primary-color"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MainNav;
