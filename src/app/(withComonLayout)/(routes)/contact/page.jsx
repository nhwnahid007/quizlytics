"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";
import { Mail, MapPinHouse, PhoneIcon } from "lucide-react";


const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    const templateParams = {
      from_name: data.name, // email js templaet {{from_name}}
      message: data.message, // email js template message
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setIsLoading(false);
        toast.success("Message sent successfully!");
        reset();
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Failed to send message.");
      });
  };

  return (
    <div className="mt-20 min-h-screen mx-5 lg:mx-0 overflow-x-hidden">
      <SectionTitleMinimal
        heading={"GET IN TOUCH WITH US"}
        subHeading="We'd love to hear from you!"
      />
      <div className="mt-12 mb-16 max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6 flex flex-col md:flex-row justify-center items-center">
        <div className="mb-12 lg:mb-0 md:w-1/2">
          <div className="mb-8 flex w-full">
            <div className="mr-6 flex h-[60px] w-[60px] p-3 items-center justify-center overflow-hidden rounded-md bg-primary/5 text-primary">
              <MapPinHouse size={32} />
            </div>
            <div className="w-full">
              <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                Our Location
              </h4>
              <p className="text-base text-body-color dark:text-dark-6">
                Dhaka
              </p>
            </div>
          </div>
          <div className="mb-8 flex w-full">
            <div className="mr-6 flex h-[60px] w-[60px] p-3 items-center justify-center overflow-hidden rounded-md bg-primary/5 text-primary">
              <PhoneIcon size={32} />
            </div>
            <div className="w-full">
              <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                Phone Number
              </h4>
              <p className="text-base text-body-color dark:text-dark-6">
                +8801784051122
              </p>
            </div>
          </div>
          <div className="mb-8 flex w-full">
            <div className="mr-6 flex h-[60px] w-[60px] p-3 items-center justify-center overflow-hidden rounded-md bg-primary/5 text-primary">
              <Mail size={32} />
            </div>
            <div className="w-full">
              <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                Email Address
              </h4>
              <p className="text-base text-body-color dark:text-dark-6">
                nhwnahid@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-6 order-2 md:order-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-800 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                placeholder="Message"
                rows="4"
                {...register("message", { required: true })}
              ></textarea>
              {errors.message && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Button
                className="text-white font-bold py-2 px-4 rounded  flex items-center"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contact;
