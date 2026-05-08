"use client";
import { getMarks } from "@/requests/get";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import moment from "moment/moment";
import useRouterHook from "@/app/hooks/useRouterHook";
import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";
import type { HistoryWithMongoId } from "@/requests/get";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";

const QuizHistory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryWithMongoId[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState(8);

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

  const handleDetails = (id: string) => {
    router.push(`/Dashboard/viewHistory/${id}`);
  };

  const getStatusBadge = (marks: number) => {
    if (marks >= 80)
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-green-200">
          Excellent
        </span>
      );
    if (marks >= 50)
      return (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-blue-200">
          Good
        </span>
      );
    return (
      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-orange-200">
        Improving
      </span>
    );
  };

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const getVisiblePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-gray-50/30">
      <div className="max-w-6xl mx-auto">
        <SectionTitleMinimal
          heading={"Quiz History"}
          subHeading={"Track every milestone of your learning journey"}
        />

        <div className="mt-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="py-5 px-6 text-gray-400 font-bold uppercase text-[11px] tracking-widest">Date</TableHead>
                  <TableHead className="py-5 px-6 text-gray-400 font-bold uppercase text-[11px] tracking-widest">Quiz Topic</TableHead>
                  <TableHead className="py-5 px-6 text-gray-400 font-bold uppercase text-[11px] tracking-widest">Examiner</TableHead>
                  <TableHead className="py-5 px-6 text-gray-400 font-bold uppercase text-[11px] tracking-widest text-center">Score</TableHead>
                  <TableHead className="py-5 px-6 text-gray-400 font-bold uppercase text-[11px] tracking-widest text-center">Status</TableHead>
                  <TableHead className="py-5 px-6 text-gray-400 font-bold uppercase text-[11px] tracking-widest text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex justify-center"><LoadingSpinner /></div>
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-gray-500 font-medium">
                      No quiz history found. Start your first journey!
                    </TableCell>
                  </TableRow>
                ) : (
                  history
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item._id}
                        className="group hover:bg-primary-color/5 transition-colors border-b border-gray-50 last:border-none"
                      >
                        <TableCell className="py-5 px-6 text-gray-600 font-medium">
                          <div className="flex flex-col">
                             <span className="text-gray-900">{moment(item.date).format("MMM Do, YYYY")}</span>
                             <span className="text-[10px] text-gray-400">{moment(item.date).fromNow()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 px-6">
                           <div className="font-bold text-gray-800 group-hover:text-primary-color transition-colors">
                             {item.quizCategory || "General"}
                           </div>
                        </TableCell>
                        <TableCell className="py-5 px-6 text-gray-500 italic text-sm">
                          {item.quizCreator || "System AI"}
                        </TableCell>
                        <TableCell className="py-5 px-6 text-center">
                          <div className="text-lg font-black text-gray-900">{item.marks}%</div>
                        </TableCell>
                        <TableCell className="py-5 px-6 text-center">
                          {getStatusBadge(item.marks ?? 0)}
                        </TableCell>
                        <TableCell className="py-5 px-6 text-right">
                          <Button
                            onClick={() => handleDetails(item._id ?? item.id ?? "")}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-primary-color hover:text-white hover:border-primary-color shadow-sm rounded-xl px-6"
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Improved Pagination */}
        {!isLoading && history.length > itemsPerPage && (
          <div className="flex justify-center mt-12 gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-gray-200 hover:bg-primary-color hover:text-white"
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {getVisiblePages().map((page, idx) => (
                page === '...' ? (
                  <span key={`dots-${idx}`} className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`w-10 h-10 rounded-xl font-bold ${
                      currentPage === page ? "bg-primary-color text-white shadow-lg shadow-primary-color/20" : "text-gray-500"
                    }`}
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border-gray-200 hover:bg-primary-color hover:text-white"
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
