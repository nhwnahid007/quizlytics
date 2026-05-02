"use client";
import React from "react";
import {Button} from "../ui/button";

// react icons
import {MdOutlineDone} from "react-icons/md";
import {RxCross1} from "react-icons/rx";
import Link from "next/link";

const Payments = () => {
  return (
    <section className="max-w-full p-[20px] mt-[55px] bg-gray-100">
      <h1 className="text-[30px] font-[500] leading-[40px] text-center">
        Find the Perfect Plan for Your Growth!
      </h1>
      <p className="text-[18px] font-[400] text-gray-400 w-full sm:w-[50%] text-center mx-auto mt-2 text">
        <span className="font-bold text-black">Quizlytics</span> is more than
        just a quiz platform; it’s a tool to empower learning, track growth, and
        drive success in knowledge enhancement and skill development.
      </p>

      {/* pricing cards */}
      <div className="flex flex-wrap justify-center items-center bg-white md:py-[30px] gap-5 py-2 lg:gap-[150px] sm:px-[40px] rounded-xl mt-10 mx-5 md:mx-48 shadow-lg">
        {/* Basic Plan */}
        <div className="w-full flex flex-col max-w-[280px] justify-between h-full bg-white toastshadow rounded-xl p-[20px] border">
          <div>
            <h3 className="text-[1.5rem] font-[600] mt-3">Basic</h3>

            <div className="flex flex-col gap-[10px] mt-5">
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Unlimited Quizzes
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Custom Quiz Creation
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-[10px]">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Certificate of Completion
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-[10px]">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Leaderboard Access
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-[10px]">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Collaboration Features
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end gap-[8px]">
              <h3 className="text-[1.8rem] font-[800]">$19</h3>
              <span className="text-[1rem] text-gray-400 mb-2">/month</span>
            </div>

            <Link
              href={{
                pathname: "/paymentCard",
                query: {plan: "Basic", price: 19},
              }}
            >
              <Button className="py-[14px] px-4 w-full bg-primary-color text-white rounded-md mt-3 hover:bg-secondary-color hover:text-black hover:font-bold">
                Choose
              </Button>
            </Link>
          </div>
        </div>

        {/* Standard Plan */}
        <div className="w-full flex flex-col max-w-[280px] justify-between h-full bg-white toastshadow rounded-xl p-[20px] border">
          <div>
            <h3 className="text-[1.5rem] font-[600] mt-3">Standard</h3>

            <div className="flex flex-col gap-[10px] mt-5">
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Unlimited Quizzes
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Custom Quiz Creation
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Certificate of Completion
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Leaderboard Access
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-[10px]">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Collaboration Features
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end gap-[8px]">
              <h3 className="text-[1.8rem] font-[800]">$123</h3>
              <span className="text-[1rem] text-gray-400 mb-2">/month</span>
            </div>

            <Link
              href={{
                pathname: "/paymentCard",
                query: {plan: "Standard", price: 123},
              }}
            >
              <Button className="py-[14px] px-4 w-full bg-primary-color text-white rounded-md mt-3 hover:bg-secondary-color hover:text-black hover:font-bold">
                Choose
              </Button>
            </Link>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="w-full flex flex-col max-w-[280px] justify-between h-full bg-white toastshadow rounded-xl p-[20px] border">
          <div>
            <h3 className="text-[1.5rem] font-[600] mt-3">Premium</h3>

            <div className="flex flex-col gap-[10px] mt-5">
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Unlimited Quizzes
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Custom Quiz Creation
              </p>
              <p className="text-[1rem] text-gray-800 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Certificate of Completion
              </p>
              <p className="text-[1rem] text-gray-800 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Leaderboard Access
              </p>
              <p className="text-[1rem] text-gray-800 flex items-center gap-[10px]">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Collaboration Features
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end gap-[8px]">
              <h3 className="text-[1.8rem] font-[800]">$189</h3>
              <span className="text-[1rem] text-gray-400 mb-2">/month</span>
            </div>

            <Link
              href={{
                pathname: "/paymentCard",
                query: {plan: "Premium", price: 189},
              }}
            >
              <Button className="py-[14px] px-4 w-full bg-primary-color text-white rounded-md mt-3 hover:bg-secondary-color hover:text-black hover:font-bold">
                Choose
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payments;
