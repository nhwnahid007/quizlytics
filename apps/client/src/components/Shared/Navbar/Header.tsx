"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LayoutDashboardIcon, LogOut, User } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const name = session?.user?.name;
  const profile = session?.user?.profile;
  const image = session?.user?.image;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full py-2.5 z-20 transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-background/95 text-foreground shadow-sm backdrop-blur"
          : "bg-background/90 text-foreground backdrop-blur"
      }`}
    >
      <div className="px-2 md:px-5 lg:px-20 mx-auto flex items-center justify-between">
        <div className="block lg:hidden">
          <MobileNav />
        </div>

        {/* Brand Logo */}
        <Link
          href="/"
          className="text-3xl items-center md:ml-5 md:text-4xl text-primary-color font-bold"
        >
          Quizlytics
        </Link>

        {/* Main Navigation for larger screens */}
        <div className="hidden md:flex justify-center grow">
          <MainNav />
        </div>

        {/* Theme Toggle + Profile */}
        <div className="relative flex items-center justify-center gap-2">
          <ThemeToggle />
          {!session ? (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-primary-color px-4 py-2 text-center font-bold text-primary-color transition-colors duration-300 hover:bg-primary-color hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden rounded-lg border border-primary-color px-4 py-2 text-center font-bold text-foreground transition-colors duration-300 hover:bg-primary-color hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:block"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Open user menu"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        profile ||
                        image ||
                        "https://i.ibb.co/ts4kH5c/istockphoto-1337144146-612x612.jpg"
                      }
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-full w-full h-full"
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-popover p-2 shadow-lg"
                sideOffset={10}
              >
                <DropdownMenuLabel className="text-center font-bold text-sm truncate">
                  {name}
                </DropdownMenuLabel>
                <DropdownMenuItem className="mb-1 flex flex-row items-center gap-2 rounded-md p-2 text-sm">
                  <Link
                    href="/Dashboard/profile"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="mb-1 flex flex-row items-center gap-2 rounded-md p-2 text-sm">
                  <Link href="/Dashboard" className="flex items-center gap-2">
                    <LayoutDashboardIcon className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex cursor-pointer flex-row items-center gap-2 rounded-md p-2 text-sm text-red-600 focus:text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
