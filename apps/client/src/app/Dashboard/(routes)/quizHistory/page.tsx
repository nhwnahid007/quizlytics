"use client";
import { getMarks } from "@/requests/get";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import moment from "moment/moment";
import useRouterHook from "@/app/hooks/useRouterHook";
import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";
import type { HistoryWithMongoId } from "@/requests/get";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { ArrowUpDown, Eye } from "lucide-react";

type SortOption = "recent" | "highest" | "lowest";

const QuizHistory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryWithMongoId[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const router = useRouterHook();
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const getQuizHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getMarks(email ?? "");
        setHistory(data);
        setIsLoading(false);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!!!",
          toast: true,
        });
        setIsLoading(false);
      }
    };
    getQuizHistory();
  }, [email]);

  const sortedHistory = useMemo(() => {
    const copy = [...history];
    switch (sortBy) {
      case "highest":
        return copy.sort((a, b) => (b.marks ?? 0) - (a.marks ?? 0));
      case "lowest":
        return copy.sort((a, b) => (a.marks ?? 0) - (b.marks ?? 0));
      case "recent":
      default:
        return copy;
    }
  }, [history, sortBy]);

  const handleDetails = (id: string) => {
    router.push(`/Dashboard/viewHistory/${id}`);
  };

  const getScoreColor = (marks: number) => {
    if (marks > 70) return { bar: "bg-green-500", text: "text-green-600" };
    if (marks >= 40) return { bar: "bg-yellow-500", text: "text-yellow-600" };
    return { bar: "bg-red-500", text: "text-red-600" };
  };

  const getStatusBadge = (marks: number) => {
    if (marks >= 80)
      return (
        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-green-200 dark:border-green-800">
          Excellent
        </span>
      );
    if (marks >= 50)
      return (
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-blue-200 dark:border-blue-800">
          Good
        </span>
      );
    return (
      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-orange-200 dark:border-orange-800">
        Improving
      </span>
    );
  };

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <SectionTitleMinimal
          heading={"Quiz History"}
          subHeading={"Track every milestone of your learning journey"}
        />

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-color"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>
        </div>

        <div className="mt-4 bg-card rounded-3xl shadow-xl shadow-muted/50 border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="py-5 px-6 text-muted-foreground font-bold uppercase text-[11px] tracking-widest">
                    Date
                  </TableHead>
                  <TableHead className="py-5 px-6 text-muted-foreground font-bold uppercase text-[11px] tracking-widest">
                    Quiz Topic
                  </TableHead>
                  <TableHead className="py-5 px-6 text-muted-foreground font-bold uppercase text-[11px] tracking-widest">
                    Examiner
                  </TableHead>
                  <TableHead className="py-5 px-6 text-muted-foreground font-bold uppercase text-[11px] tracking-widest text-center">
                    Score
                  </TableHead>
                  <TableHead className="py-5 px-6 text-muted-foreground font-bold uppercase text-[11px] tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="py-5 px-6 text-muted-foreground font-bold uppercase text-[11px] tracking-widest text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex justify-center">
                        <LoadingSpinner />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedHistory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-40 text-center text-muted-foreground font-medium"
                    >
                      No quiz history found. Start your first journey!
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedHistory
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map(item => {
                      const score = item.marks ?? 0;
                      const colors = getScoreColor(score);
                      return (
                        <TableRow
                          key={item._id}
                          className="group hover:bg-primary-color/5 transition-colors border-b border-border last:border-none"
                        >
                          <TableCell className="py-5 px-6">
                            <div className="flex flex-col">
                              <span className="text-foreground font-medium">
                                {moment(item.date).format("MMM Do, YYYY")}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {moment(item.date).fromNow()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5 px-6">
                            <div className="font-bold text-foreground group-hover:text-primary-color transition-colors">
                              {item.quizCategory || "General"}
                            </div>
                          </TableCell>
                          <TableCell className="py-5 px-6 text-muted-foreground italic text-sm">
                            {item.quizCreator || "System AI"}
                          </TableCell>
                          <TableCell className="py-5 px-6">
                            <div className="flex flex-col items-center gap-1.5">
                              <span
                                className={`text-lg font-black ${colors.text}`}
                              >
                                {score}%
                              </span>
                              <div className="w-full max-w-20">
                                <Progress
                                  value={score}
                                  className={`h-1.5 ${colors.bar}`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-5 px-6 text-center">
                            {getStatusBadge(score)}
                          </TableCell>
                          <TableCell className="py-5 px-6 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={() =>
                                  handleDetails(item._id ?? item.id ?? "")
                                }
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-border hover:bg-primary-color hover:text-white hover:border-primary-color gap-1.5"
                              >
                                <Eye className="h-4 w-4" />
                                Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && sortedHistory.length > itemsPerPage && (
          <div className="flex justify-center mt-12 gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-border hover:bg-primary-color hover:text-white"
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {getVisiblePages().map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-3 py-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`w-10 h-10 rounded-xl font-bold ${
                      currentPage === page
                        ? "bg-primary-color text-white shadow-lg shadow-primary-color/20"
                        : "text-muted-foreground"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-xl border-border hover:bg-primary-color hover:text-white"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
