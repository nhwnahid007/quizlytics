"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaCommentDots,
  FaDatabase,
  FaPeopleArrows,
  FaUser,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaFileCircleQuestion, FaPeopleGroup } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChartNoAxesCombined,
  ChartSpline,
  CreditCard,
  Database,
  FileQuestion,
  FileStack,
  House,
  Medal,
  ShieldEllipsis,
  ShieldQuestion,
  UserCog,
  Users,
} from "lucide-react";
import useRole from "@/app/hooks/useRole";
import LoadingSpinner from "../Spinner/LoadingSpinner";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pathname = usePathname();

  const [role, roleLoading] = useRole();

  const isActive = (route) => pathname === route;

  const Menus = [
    { title: "Home", route: "/Dashboard", icon: <ChartSpline /> },
    {
      title: "Make custom questions",
      route: "/Dashboard/customquestion",
      icon: <FileQuestion />,
    },
    {
      title: "All Custom questions",
      route: "/Dashboard/examinersDashboard",
      icon: <ShieldQuestion />,
    },
    {
      title: "Leaderboard",
      route: "/Dashboard/leaderboard",
      icon: <Medal />,
    },
    {
      title: "My Progress",
      route: "/Dashboard/statistics",
      icon: <ChartNoAxesCombined/>,
    },
    {
      title: "Quiz History",
      route: "/Dashboard/quizHistory",
      icon: <FileStack />,
    },
    {
      title: "All Examinee",
      route: "/Dashboard/allExaminee",
      icon: <Users />,
    },
    {
      title: "User Management",
      route: "/Dashboard/allUser",
      icon: <UserCog />,
    },
    {
      title: "Payment",
      route: "/Dashboard/payment",
      icon: <CreditCard />,
    },
  ].filter(
    (menu) =>
      role === "admin" ||
      (role === "user" &&
        ["Leaderboard", "My Progress", "Home"].includes(menu.title)) ||
      (role === "teacher" &&
        !["User Management", "Payment"].includes(menu.title))
  );

  return (
    <div className="flex">
      <div
        className={`${
          isSidebarOpen ? "w-72 p-3" : "w-10 p-[6]"
        } bg-[#FBF8FF] h-auto pt-8 relative duration-300 text-primary-color`}
      >
        <button
          className="absolute text-3xl cursor-pointer -right-3 top-9 w-7 border-gray-800 border-2 rounded-full bg-secondary-color text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <FiChevronLeft className="h-6 w-6" />
          ) : (
            <FiChevronRight className="h-6 w-6" />
          )}
        </button>
        <div className="flex gap-x-4 items-center">
          <Link
            href="/Dashboard"
            className={`text-primary-color origin-left font-bold text-2xl duration-200 ${
              !isSidebarOpen && "scale-0"
            }`}
          >
            Dashboard
          </Link>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <Link href={Menu.route} key={index}>
              <li
                className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-200 text-primary-color text-sm font-semibold items-center gap-x-2 ${
                  isActive(Menu.route) ? "bg-gray-300 text-secondary-color" : ""
                }`}
              >
                <span
                  className={`text-md ${
                    isActive(Menu.route) ? "text-secondary-color" : ""
                  }`}
                >
                  {Menu.icon}
                </span>
                <span
                  className={`origin-left duration-200 ${
                    !isSidebarOpen ? "hidden" : "block"
                  }`}
                >
                  {Menu.title}
                </span>
              </li>
            </Link>
          ))}
          <Link href="/">
            <li className="flex rounded-md p-2 cursor-pointer hover:bg-gray-200 text-primary-color text-sm font-semibold items-center gap-x-4">
              <span
                className={`text-lg ${
                  pathname === "/" ? "text-secondary-color" : ""
                }`}
              >
                <House />
              </span>
              <span
                className={`origin-left duration-200 ${
                  !isSidebarOpen ? "hidden" : "block"
                }`}
              >
                Go to Homepage
              </span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
