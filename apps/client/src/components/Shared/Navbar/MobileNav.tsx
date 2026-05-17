import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsOpen(false); // Close the sheet when a link is clicked
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary-color transition hover:bg-primary-color/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open navigation menu"
        >
          <AlignJustify className="h-6 w-6" aria-hidden="true" />
        </SheetTrigger>

        <SheetContent side="left">
          <nav
            className="mt-6 flex flex-col gap-2"
            aria-label="Mobile navigation"
          >
            {navItems.map(item => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "bg-primary-color/10 text-primary-color"
                      : "text-foreground hover:bg-muted hover:text-primary-color"
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
