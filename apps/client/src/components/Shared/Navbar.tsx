"use client"; // Ensure this is the first line in the file

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  // access next auth session
  const { data: session } = useSession();
  const name = session?.user?.name;
  const profile = session?.user?.profile;
  const image = session?.user?.image;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`py-2 ${isActive ? "bg-gray-800" : "bg-black"} text-white`}>
      <div className="navbar max-w-6xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="blogs">Blogs</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/team">Our Team</Link>
              </li>
            </ul>
          </div>
          <Link href="/" className="text-4xl text-[#ff0000] font-bold">
            Quiz<span className="text-[#ffefd3]">lytics</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex relative z-10 text-[#ffefd3]">
          <ul className="menu menu-horizontal px-1 text-base">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <summary>
                <Link href="blogs">Blogs</Link>
              </summary>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/team">Our Team</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end flex gap-4">
          {!session ? (
            <div className="flex gap-2 md:gap-4">
              <Link href="/login" className="btn px-2 md:px-8 bg-[#ffefd3]">
                Login
              </Link>
              <Link href="/register" className="btn px-2 md:px-8 bg-[#ffefd3]">
                Register
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost w-[64px] h-[64px] avatar"
              >
                <div className="w-full h-full rounded-full">
                  <Image
                    src={
                      profile ||
                      image ||
                      "https://i.ibb.co.com/ts4kH5c/istockphoto-1337144146-612x612.jpg"
                    }
                    alt="user"
                    width={64} // Explicitly set the width
                    height={64} // Explicitly set the height
                    className="rounded-full w-full h-full"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#ffefd3] rounded-box mt-3 w-60 p-6 relative z-20 shadow"
              >
                <li className="text-center text-black font-bold text-lg px-4 mb-4 leading-6">
                  {name}
                </li>
                <li className="bg-black text-[#ffefd3] p-2 rounded-xl mb-2">
                  <Link href="/Dashboard">My Dashboard</Link>
                </li>
                <li
                  className="bg-black text-[#ffefd3] px-4 py-2 rounded-xl cursor-pointer"
                  onClick={() => signOut()}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
