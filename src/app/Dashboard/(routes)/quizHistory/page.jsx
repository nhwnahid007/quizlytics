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
import Link from "next/link";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";


const QuizHistory = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const router = useRouterHook();

  const { data: session } = useSession();
  const email = session?.user?.email;

  console.log("history",history)

  useEffect(() => {
    const getQuizHistory = async () => {
      try {
        setHistory([]);
        const data = await getMarks(email);
        setHistory(data);
        setIsLoading(false);
      } catch (error) {
        console.log("data fetching error", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!!!",
          toast: true,
        });
      }
    };
    getQuizHistory();
  }, [email]);

  const handleDetails = (id) => {
    router.push(`/Dashboard/viewHistory/${id}`);
  };

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const pageRange = 3;
  const getVisiblePages = () => {
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen lg:mx-20 my-auto mx-auto p-5 relative overflow-auto">
      <div className="">
        <SectionTitleMinimal heading={" Quiz History"} subHeading={"List of all your quiz attempts"}></SectionTitleMinimal>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : history.length === 0 ? (
          <div className="text-center my-12">
            <h2 className="text-2xl font-semibold mb-4">
              No Quizzes Attempted Yet
            </h2>
            <p className="text-gray-600 mb-6">
              It seems like you haven&apos;t taken any quizzes yet. Start your
              learning journey by taking your first quiz now!
            </p>
            <Link href="/Dashboard">
              <button className="bg-primary-color font-semibold text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-200">
                Attempt Your First Quiz
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden shadow-md h-[400px] sm:rounded-lg">
            <div className="overflow-x-auto">
              <Table className="w-full min-w-full table-auto">
                {/* <TableCaption>A list of your attempts in Custom Quiz.</TableCaption> */}
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead>Quiz On</TableHead>
                    <TableHead>Examiner</TableHead>
                    <TableHead className="text-center">Marks Obtained</TableHead>
                    <TableHead className="text-right">Attempt Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((item, idx) => (
                      <TableRow
                        className="hover:bg-gray-50 transition-colors py-2 duration-200"
                        key={item._id}
                      >
                        <TableCell className="font-medium px-4 py-4">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          {moment(item.date).format("MMMM Do YYYY")}
                        </TableCell>
                        <TableCell className="px-4 py-4">{item.quizCategory}</TableCell>
                        <TableCell className="px-4 py-4">{item.quizCreator}</TableCell>
                        <TableCell className="text-center font-bold px-4 py-4">
                          {item.marks}%
                        </TableCell>
                        <TableCell className="text-right px-4 py-4">
                          <Button
                            onClick={() => handleDetails(item._id)}
                            className=""
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {history.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex justify-between space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-md ${
                  currentPage === 1 ? "bg-gray-300" : "bg-primary-color text-white"
                }`}
              >
                &#8592;
              </Button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    currentPage === page ? "bg-primary-color text-white" : "bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded-md ${
                  currentPage === totalPages ? "bg-gray-300" : "bg-primary-color text-white"
                }`}
              >
                &#8594;
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
