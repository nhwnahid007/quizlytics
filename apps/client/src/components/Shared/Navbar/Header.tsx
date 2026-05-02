"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./MainNav"; // Keep this for your main navigation
import MobileNav from "./MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LayoutDashboardIcon, LogOut } from "lucide-react";

const Header = () => {
  const { data: session, status } = useSession();
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
      className={`fixed top-0 left-0 w-full py-[10px] z-20 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-black shadow-md"
          : "bg-transparent text-white"
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
        <div className="hidden md:flex justify-center flex-grow">
          <MainNav />
        </div>

        {/* Profile or Login/Register */}
        <div className="relative flex items-center justify-center gap-4">
          {!session ? (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="border border-purple-600 text-primary-color font-bold rounded-md px-4 py-2 text-center hover:bg-purple-600 hover:text-white transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-purple-600 hidden md:block text-secondary-color font-bold rounded-md px-4 py-2 text-center hover:bg-purple-600 hover:text-white transition-colors duration-300"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  {/* Smaller Profile Image */}
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
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white rounded-md p-4 shadow-lg absolute right-0 mt-2 z-50 w-48"
                sideOffset={10}
              >
                <DropdownMenuLabel className="text-center font-bold text-sm truncate">
                  {name}
                </DropdownMenuLabel>
                <DropdownMenuItem className="bg-purple-600 flex flex-row items-center gap-2 text-white p-2 text-sm rounded-md mb-2 text-center">
                  <Link href="/Dashboard" className="flex items-center gap-2">
                    <LayoutDashboardIcon /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="bg-purple-600 text-sm flex flex-row items-center gap-2 text-white p-2 rounded-md text-center cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut /> Logout
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
