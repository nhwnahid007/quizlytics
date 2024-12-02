"use client";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { useSession } from "next-auth/react";

const UserFeedback = () => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const name = session?.user?.name;
  const email = session?.user?.email;
  const profile = session?.user?.profile;
  const image = session?.user?.image;

  // Fetch all feedback on component mount
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          "https://quizlytics.jonomukti.org/all-feedback"
        );
        setFeedback(response.data);
      } catch (err) {
        setError("Failed to fetch feedback.");
      }
    };
    fetchFeedback();
  }, []);

  // Handle feedback submission
  const handleSubmit = async () => {
    if (message.trim() === "" || rating === 0) {
      setError("Please provide a message and a rating.");
      return;
    }

    try {
      await axios.post("https://quizlytics.jonomukti.org/feedback", {
        message,
        rating,
        name,
        image,
        profile,
        email,
      });
      setMessage("");
      setRating(0);
      setError("");
      setisModalOpen(false);

      // Optionally fetch updated feedback after submission
      const response = await axios.get(
        "https://quizlytics.jonomukti.org/all-feedback"
      );
      setFeedback(response.data);
    } catch (err) {
      setError("Failed to submit feedback.");
    }
  };

  return (
    <>
      <div className=" mb-4 flex items-center gap-5 justify-center">
        <div className="w-full flex items-center justify-center">
          <button
            className="px-6 md:px-8 py-2 rounded-xl font-bold border-2 text-white bg-primary-color bg-opacity-70 hover:bg-transparent hover:text-primary-color transition-colors duration-300 border-gradient text-xm"
            onClick={() => setisModalOpen(true)}
          >
            Give Us Feedback
          </button>
        </div>

        {/* Modal */}
        <div
          className={`${
            isModalOpen ? "visible" : "invisible"
          } w-full h-screen fixed top-0 left-0 z-50 bg-[#0000002a] transition-all duration-300 flex items-center justify-center`}
        >
          <div
            className={`${
              isModalOpen ? "scale-[1] opacity-100" : "scale-[0] opacity-0"
            } w-[80%] md:w-[60%] lg:w-[40%] 2xl:w-[25%] bg-[#fff] rounded-lg transition-all duration-300  lg:mx-auto p-4  mt-8`}
          >
            <div className="w-full flex items-end p-4 justify-between border-b border-[#d1d1d1]">
              <h1 className="text-[1.5rem] font-bold">
                Your Feedback about Quizlytics
              </h1>
              <RxCross1
                className="p-2 text-[2.5rem] text-white bg-primary-color hover:bg-[#e7e7e7] rounded-full transition-all duration-300 cursor-pointer opacity-80"
                onClick={() => setisModalOpen(false)}
              />
            </div>

            {/* Feedback form */}
            <div className="p-4 border-b border-[#d1d1d1]">
              {error && <p className="text-red-500 mb-2">{error}</p>}
              <div className="w-[100%] mb-4">
                <label htmlFor="message" className="font-[400] text-[15px]">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  type="text"
                  name="message"
                  id="message"
                  placeholder="Write something about Quizlytics"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-[#e5eaf2] border rounded-md outline-none mt-1 px-4 w-full py-3 min-h-[200px] focus:border-[#3B9DF8] transition-colors duration-300"
                />
              </div>

              {/* Star rating */}
              <div className="flex items-center space-x-1 mt-2">
                {[...Array(5)].map((_, index) => {
                  const starRating = index + 1;
                  return (
                    <FaStar
                      key={starRating}
                      className={`cursor-pointer ${
                        starRating <= rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      size={24}
                      onClick={() => setRating(starRating)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 p-4">
              <button
                className="px-6 md:px-8 py-2 rounded-xl font-bold border-2 text-white bg-purple-600 hover:bg-transparent hover:text-black transition-colors duration-300 border-gradient text-xm opacity-80"
                onClick={() => setisModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 md:px-8 py-2 rounded-xl font-bold border-2 text-purple-600  hover:bg-transparent hover:text-black transition-colors duration-300 border-gradient text-xm"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFeedback;
