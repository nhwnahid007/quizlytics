"use client";
import { getExaminees } from "@/requests/get";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import useRole from "@/app/hooks/useRole";
import NotFound from "@/app/not-found";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";
import { Button } from "@/components/ui/button";

const ExamineeList = () => {
  const [examinees, setExaminees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [quizStartKey, setQuizStartKey] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const [role, roleLoading, roleError] = useRole();
  console.log("Role:", role);
  console.log("Role Loading:", roleLoading);
  console.log("Role Error:", roleError);
  

  useEffect(() => {
    const fetchExaminees = async () => {
      try {
        const data = await getExaminees();
        setExaminees(data);
      } catch (error) {
        console.error("Error fetching examinees", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while fetching examinee data!",
          toast: true,
        });
      }
    };
    fetchExaminees();
  }, []);

  const filteredExaminees = examinees.filter(
    (examinee) =>
      typeof examinee.userName === "string" &&
      examinee.userName.toLowerCase().includes(nameFilter.toLowerCase()) &&
      examinee.quizStartKey.includes(quizStartKey)
  );

  const totalPages = Math.ceil(filteredExaminees.length / itemsPerPage);
  const pageRange = 3; 
  const getVisiblePages = () => {
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleQuizStartKeyChange = (event) => {
    setQuizStartKey(event.target.value);
    setCurrentPage(1);
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
    setCurrentPage(1);
  };

  if (roleLoading) return (
    <div>
      <LoadingSpinner />
    </div>
  );
  if (roleError) return <NotFound />;
  if (!roleLoading && (role !== "teacher" && role !== "admin")) {
    return <NotFound />;
  }

  return (
    <div className=" h-screen px-2 max-w-6xl mx-auto">
      {/* <div className="text-center my-5 text-3xl font-bold">All Examinees</div> */}
      <SectionTitleMinimal heading={"All Examinees"}></SectionTitleMinimal>

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <input
          type="text"
          value={quizStartKey}
          onChange={handleQuizStartKeyChange}
          placeholder="Filter by Quiz Start Key"
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring focus:ring-primary transition duration-300"
        />
        <input
          type="text"
          value={nameFilter}
          onChange={handleNameFilterChange}
          placeholder="Filter by Examinee Name"
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring focus:ring-primary transition duration-300"
        />
      </div>

      <div className="relative overflow-auto">
        <div className="overflow-hidden shadow-md h-[375px] sm:rounded-lg">
          <Table className="w-full min-w-full table-fixed">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50px] text-left">#</TableHead>
                <TableHead className="text-center w-[80px]">Photo</TableHead>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead className="w-[220px]">Email</TableHead>
                <TableHead className="w-[150px]">Quiz Title</TableHead>
                <TableHead className="w-[80px]">Marks</TableHead>
                <TableHead className="text-right w-[220px]">Examiner&apos;s Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExaminees
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((examinee, idx) => (
                  <TableRow
                    key={examinee._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="font-semibold text-gray-600">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      <Image
                        src={examinee.userImg || "/default-avatar.png"}
                        alt={examinee.userName}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {examinee.userName}
                    </TableCell>
                    <TableCell className="font-light text-gray-500 truncate max-w-[200px]">
                      {examinee.userEmail}
                    </TableCell>
                    <TableCell className="font-light text-gray-500">
                      {examinee.quizTitle}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-600">
                      {examinee.marks}%
                    </TableCell>
                    <TableCell className="text-right font-light text-gray-500 truncate max-w-[200px]">
                      {examinee.quizCreator}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? "bg-gray-300" : "bg-primary-color text-white"
            }`}
          >
            &#8592; 
          </Button>

         
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page ? "bg-primary-color text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages ? "bg-gray-300" : "bg-primary-color text-white"
            }`}
          >
            &#8594; 
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamineeList;
