"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { signOut } from "next-auth/react";
import {
  BookOpenCheck,
  ChartNoAxesCombined,
  FileQuestion,
  History,
  House,
  LogOut,
  Medal,
  ShieldQuestion,
  UserCog,
  Users,
  UserCircle,
} from "lucide-react";
import useRole from "@/app/hooks/useRole";

const Sidebar = ({ className, style }: React.HTMLAttributes<HTMLDivElement>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pathname = usePathname();

  const [role, roleLoading] = useRole();

  const isActive = (route: string) => {
    if (route === "/Dashboard") return pathname === "/Dashboard";
    return pathname.startsWith(route);
  };

  const Menus = [
    { title: "Take your Quiz", route: "/Dashboard", icon: <BookOpenCheck /> },
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
      icon: <ChartNoAxesCombined />,
    },
    {
      title: "Quiz History",
      route: "/Dashboard/quizHistory",
      icon: <History />,
    },
    {
      title: "My Profile",
      route: "/profile",
      icon: <UserCircle />,
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
  ].filter(
    (menu) =>
      role === "admin" ||
      (role === "user" &&
        ["Leaderboard", "My Progress", "Take your Quiz", "My Profile"].includes(menu.title)) ||
      (role === "teacher" &&
        !["User Management", "Payment"].includes(menu.title)),
  );

  return (
    <div className={`flex ${className ?? ""}`} style={style}>
      <div
        className={`${
          isSidebarOpen ? "w-72 p-4" : "w-16 p-2"
        } bg-card/80 backdrop-blur-md border-r border-border h-auto pt-8 relative duration-300 text-primary-color flex flex-col justify-between shadow-xl`}
      >
        <div>
          <button
            className="absolute text-3xl cursor-pointer -right-3 top-9 w-7 h-7 border-border border rounded-full bg-card text-primary-color shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <FiChevronLeft className="h-4 w-4" />
            ) : (
              <FiChevronRight className="h-4 w-4" />
            )}
          </button>
          <div className="flex gap-x-4 items-center px-2">
            <div className="bg-primary-color p-2 rounded-xl">
               <BookOpenCheck className="text-white w-6 h-6" />
            </div>
            <Link
              href="/Dashboard"
              className={`text-primary-color origin-left font-bold text-xl tracking-tight duration-200 ${
                !isSidebarOpen && "scale-0"
              }`}
            >
              Quizlytics
            </Link>
          </div>
          <ul className="pt-8 space-y-2">
            {Menus.map((Menu, index) => (
              <Link href={Menu.route} key={index}>
                <li
                  className={`flex rounded-xl p-3 cursor-pointer transition-all duration-200 items-center gap-x-3 group ${
                    isActive(Menu.route)
                      ? "bg-primary-color text-white shadow-lg shadow-primary-color/30"
                      : "hover:bg-primary-color/10 text-muted-foreground hover:text-primary-color"
                  }`}
                >
                  <span
                    className={`text-xl transition-colors ${
                      isActive(Menu.route)
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-primary-color"
                    }`}
                  >
                    {Menu.icon}
                  </span>
                  <span
                    className={`origin-left font-medium duration-200 ${
                      !isSidebarOpen ? "hidden" : "block"
                    }`}
                  >
                    {Menu.title}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 mt-auto pt-10">
          <Link href="/">
            <li className="flex rounded-xl p-3 cursor-pointer hover:bg-muted text-muted-foreground font-medium items-center gap-x-4 transition-colors">
              <span className="text-xl text-muted-foreground">
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
          <button
            onClick={() => signOut()}
            className="flex rounded-xl p-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 font-medium items-center gap-x-4 transition-colors"
          >
            <span className="text-xl text-muted-foreground group-hover:text-red-600">
              <LogOut />
            </span>
            <span
              className={`origin-left duration-200 ${
                !isSidebarOpen ? "hidden" : "block"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
