"use client";
import { allCustomQuiz } from "@/requests/get";
import { useState, useEffect } from "react";
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
import { RiDeleteBinLine } from "react-icons/ri";
import useAllQuiz from "@/app/hooks/useAllQuiz";
import axios from "axios";
import Swal from "sweetalert2";
import NotFound from "@/app/not-found";
import useRole from "@/app/hooks/useRole";


import { FaRegCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";


const Page = () => {
  const [AllQuiz, refetch] = useAllQuiz();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(AllQuiz.length / itemsPerPage);
  const currentQuizzes = AllQuiz.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [role, roleError, roleLoading] = useRole();

  useEffect(() => {
    if (AllQuiz.length > 0 || roleError) {
      setLoading(false);
    }
  }, [AllQuiz, roleError]);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      toast: true,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://quizlytics.jonomukti.org/deleteCustomQuiz?qKey=${id}`
          )
          .then(() => {
            refetch();
            Swal.fire({
              title: "Deleted!",
              toast: true,
              text: "Quiz set has been deleted.",
              icon: "success",
            });
          });
      }
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
     toast.success("Quiz code has been copied to clipboard.");
    });
  };

  if (roleLoading || loading) return <LoadingSpinner />;

  if (role == "user") {
    return <NotFound />;
  }

  return (
    <div className="h-screen lg:mx-20 px-5  mx-auto">
      <main className="max-w-6xl mx-auto">
      
        <SectionTitleMinimal heading={"All Custom Questions"} subHeading={"Explore the List of all custom questions"}></SectionTitleMinimal>
        <div className="h-[460px] lg:h-[410px]">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-[50px]">SI</TableHead>
                <TableHead className="w-[120px]">Quiz Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quiz Creator</TableHead>
                <TableHead className="text-center">Number of Questions</TableHead>
                <TableHead className="text-right">Delete Quiz</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentQuizzes.map((item, idx) => (
                <TableRow key={item.quizStartKey}>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium flex  items-center ">
                    {item.quizStartKey}
                    <Tooltip>
                      <TooltipTrigger>
                        <FaRegCopy
                          onClick={() => handleCopy(item.quizStartKey)}
                          className="ml-2 cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Copy to clipboard
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{item.quizTitle}</TableCell>
                  <TableCell>{item.quizCategory}</TableCell>
                  <TableCell>{item.quizCreator}</TableCell>
                  <TableCell className="text-center">{item.quizArr.length}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="buttonOutline"
                      size="sm"
                      onClick={() => handleDelete(item.quizStartKey)}
                    >
                      <RiDeleteBinLine className="mr-1" />
                      
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? "bg-gray-300" : "bg-primary-color text-white"
            }`}
          >
            &#8592; {/* Left arrow for previous */}
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-primary-color text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages ? "bg-gray-300" : "bg-primary-color text-white"
            }`}
          >
            &#8594; {/* Right arrow for next */}
          </button>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Page;
