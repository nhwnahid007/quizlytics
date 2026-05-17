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

const Sidebar = ({
  className,
  style,
}: React.HTMLAttributes<HTMLDivElement>) => {
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
    { title: "Start Quiz", route: "/Dashboard", icon: <BookOpenCheck /> },
    {
      title: "Create Questions",
      route: "/Dashboard/customquestion",
      icon: <FileQuestion />,
    },
    {
      title: "Custom Questions",
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
      route: "/Dashboard/profile",
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
    menu =>
      role === "admin" ||
      (role === "user" &&
        [
          "Leaderboard",
          "My Progress",
          "Start Quiz",
          "My Profile",
          "Quiz History",
        ].includes(menu.title)) ||
      (role === "teacher" &&
        !["User Management", "Payment"].includes(menu.title))
  );

  return (
    <div className={`flex ${className ?? ""}`} style={style}>
      <div
        className={`${
          isSidebarOpen ? "w-72 p-4" : "w-20 p-2"
        } bg-card/80 backdrop-blur-md border-r border-border h-auto pt-8 relative duration-300 text-primary-color flex flex-col justify-between shadow-xl`}
      >
        <div>
          <button
            type="button"
            className="absolute -right-3 top-9 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-3xl text-primary-color shadow-md transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
            ) : (
              <FiChevronRight className="h-4 w-4" aria-hidden="true" />
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
          <nav className="pt-8" aria-label="Dashboard navigation">
            <ul className="flex flex-col gap-2">
              {Menus.map(Menu => (
                <li key={Menu.route}>
                  <Link
                    href={Menu.route}
                    aria-current={isActive(Menu.route) ? "page" : undefined}
                    className={`flex rounded-xl transition-all duration-300 items-center group ${
                      !isSidebarOpen
                        ? "justify-center p-2 mx-auto w-12 h-12"
                        : "p-3 gap-x-3"
                    } ${
                      isActive(Menu.route)
                        ? "bg-primary-color text-white shadow-xl shadow-primary-color/20 scale-[1.02]"
                        : "hover:bg-primary-color/10 text-muted-foreground hover:text-primary-color hover:scale-[1.02] hover:shadow-md"
                    }`}
                  >
                    <span
                      className={`transition-colors duration-300 flex items-center justify-center ${
                        !isSidebarOpen ? "text-2xl" : "text-xl"
                      } ${
                        isActive(Menu.route)
                          ? "text-white"
                          : "text-muted-foreground group-hover:text-primary-color"
                      }`}
                    >
                      {Menu.icon}
                    </span>
                    <span
                      className={`origin-left font-medium duration-300 ${
                        !isSidebarOpen ? "hidden" : "block"
                      }`}
                    >
                      {Menu.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-y-4 mt-auto pt-10">
          <Link
            href="/"
            className="flex rounded-xl p-3 cursor-pointer hover:bg-muted text-muted-foreground font-medium items-center gap-x-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-xl text-muted-foreground">
              <House aria-hidden="true" />
            </span>
            <span
              className={`origin-left duration-200 ${
                !isSidebarOpen ? "hidden" : "block"
              }`}
            >
              Go to Homepage
            </span>
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex rounded-xl p-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 font-medium items-center gap-x-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-xl text-muted-foreground group-hover:text-red-600">
              <LogOut aria-hidden="true" />
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
