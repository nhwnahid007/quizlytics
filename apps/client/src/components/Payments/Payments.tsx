"use client";
import React from "react";
import {Button} from "../ui/button";

// react icons
import {MdOutlineDone} from "react-icons/md";
import {RxCross1} from "react-icons/rx";
import Link from "next/link";

const Payments = () => {
  return (
    <section className="max-w-full p-5 mt-13.75 bg-gray-100">
      <h1 className="text-[30px] font-medium leading-10 text-center">
        Find the Perfect Plan for Your Growth!
      </h1>
      <p className="text-[18px] font-normal text-gray-400 w-full sm:w-[50%] text-center mx-auto mt-2 text">
        <span className="font-bold text-black">Quizlytics</span> is more than
        just a quiz platform; it’s a tool to empower learning, track growth, and
        drive success in knowledge enhancement and skill development.
      </p>

      {/* pricing cards */}
      <div className="flex flex-wrap justify-center items-center bg-white md:py-7.5 gap-5 py-2 lg:gap-37.5 sm:px-10 rounded-xl mt-10 mx-5 md:mx-48 shadow-lg">
        {/* Basic Plan */}
        <div className="w-full flex flex-col max-w-70 justify-between h-full bg-white toastshadow rounded-xl p-5 border">
          <div>
            <h3 className="text-[1.5rem] font-semibold mt-3">Basic</h3>

            <div className="flex flex-col gap-2.5 mt-5">
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Unlimited Quizzes
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Custom Quiz Creation
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-2.5">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Certificate of Completion
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-2.5">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Leaderboard Access
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-2.5">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Collaboration Features
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end gap-2">
              <h3 className="text-[1.8rem] font-extrabold">$19</h3>
              <span className="text-[1rem] text-gray-400 mb-2">/month</span>
            </div>

            <Link
              href={{
                pathname: "/paymentCard",
                query: {plan: "Basic", price: 19},
              }}
            >
              <Button className="py-3.5 px-4 w-full bg-primary-color text-white rounded-md mt-3 hover:bg-secondary-color hover:text-white hover:font-bold">
                Choose
              </Button>
            </Link>
          </div>
        </div>

        {/* Standard Plan */}
        <div className="w-full flex flex-col max-w-70 justify-between h-full bg-white toastshadow rounded-xl p-5 border">
          <div>
            <h3 className="text-[1.5rem] font-semibold mt-3">Standard</h3>

            <div className="flex flex-col gap-2.5 mt-5">
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Unlimited Quizzes
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Custom Quiz Creation
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Certificate of Completion
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Leaderboard Access
              </p>
              <p className="text-[1rem] text-gray-300 flex items-center gap-2.5">
                <RxCross1 className="text-[1.5rem] p-1 rounded-full text-gray-300" />
                Collaboration Features
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end gap-2">
              <h3 className="text-[1.8rem] font-extrabold">$123</h3>
              <span className="text-[1rem] text-gray-400 mb-2">/month</span>
            </div>

            <Link
              href={{
                pathname: "/paymentCard",
                query: {plan: "Standard", price: 123},
              }}
            >
              <Button className="py-3.5 px-4 w-full bg-primary-color text-white rounded-md mt-3 hover:bg-secondary-color hover:text-white hover:font-bold">
                Choose
              </Button>
            </Link>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="w-full flex flex-col max-w-70 justify-between h-full bg-white toastshadow rounded-xl p-5 border">
          <div>
            <h3 className="text-[1.5rem] font-semibold mt-3">Premium</h3>

            <div className="flex flex-col gap-2.5 mt-5">
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Unlimited Quizzes
              </p>
              <p className="text-[1rem] text-gray-500 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Custom Quiz Creation
              </p>
              <p className="text-[1rem] text-gray-800 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Certificate of Completion
              </p>
              <p className="text-[1rem] text-gray-800 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Leaderboard Access
              </p>
              <p className="text-[1rem] text-gray-800 flex items-center gap-2.5">
                <MdOutlineDone className="text-[1.5rem] p-1 rounded-full text-gray-800" />
                Collaboration Features
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end gap-2">
              <h3 className="text-[1.8rem] font-extrabold">$189</h3>
              <span className="text-[1rem] text-gray-400 mb-2">/month</span>
            </div>

            <Link
              href={{
                pathname: "/paymentCard",
                query: {plan: "Premium", price: 189},
              }}
            >
              <Button className="py-3.5 px-4 w-full bg-primary-color text-white rounded-md mt-3 hover:bg-secondary-color hover:text-white hover:font-bold">
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
