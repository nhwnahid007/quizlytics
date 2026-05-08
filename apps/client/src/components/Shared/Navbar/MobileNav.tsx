import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {AlignJustify} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sheet open/close
  const pathname = usePathname(); // Hook to get current route

  const handleLinkClick = () => {
    setIsOpen(false); // Close the sheet when a link is clicked
  };

  return (
    <div className="lg:hidden">
      {/* Sheet component for mobile navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* Icon to trigger the Sheet (side menu) */}
        <SheetTrigger>
          <AlignJustify className="h-6 mt-2 w-8 md:h-10 md:w-10 my-auto text-primary-color" />
        </SheetTrigger>

        {/* Content inside the Sheet */}
        <SheetContent side="left">
          {/* Navigation links in the mobile menu */}
          <nav className="flex flex-col gap-3 mt-6">
            <Link
              href="/"
              className={`py-2 font-semibold ${
                pathname === "/"
                  ? "text-primary-color font-bold"
                  : "text-secondary-color"
              }`}
              onClick={handleLinkClick}
            >
              Home
            </Link>

            <Link
              href="/blogs"
              className={`py-2 font-semibold ${
                pathname === "/blogs"
                  ? "text-primary-color font-bold"
                  : "text-secondary-color"
              }`}
              onClick={handleLinkClick}
            >
              Blogs
            </Link>

            <Link
              href="/about"
              className={`py-2 font-semibold ${
                pathname === "/about"
                  ? "text-primary-color font-bold"
                  : "text-secondary-color"
              }`}
              onClick={handleLinkClick}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`py-2 font-semibold ${
                pathname === "/contact"
                  ? "text-primary-color font-bold"
                  : "text-secondary-color"
              }`}
              onClick={handleLinkClick}
            >
              Contact
            </Link>

            {/* <Link
              href="/team"
              className={`py-2 font-semibold ${
                pathname === "/team"
                  ? "text-primary-color font-bold"
                  : "text-secondary-color"
              }`}
              onClick={handleLinkClick}
            >
              Our Team
            </Link> */}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
