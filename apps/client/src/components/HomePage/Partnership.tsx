import React from "react";
import Image from "next/image";
import { FaCircleDot } from "react-icons/fa6";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

const Partnership = () => {
  return (
    <div className="">
      <SectionTitleMinimal
        heading={"Master Your Quiz Journey"}
        subHeading={"Unlock your full potential with our comprehensive quiz strategies"}
      >
      </SectionTitleMinimal>
      <div className="w-[90%] md:max-w-6xl py-8 mx-auto text">
        <div className="w-full bg-gray-100 text-black rounded-2xl  p-8 flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4">
          <div className="relative w-full lg:w-[40%] h-[370px] md:h-[420px]">
            <Image
              src={"https://i.ibb.co.com/3dqN05S/2121601-prev-ui.png"}
              alt="rules"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <div className="w-full lg:w-[60%]">
            <h3 className="text-3xl font-bold mb-4 text-primary-color">
              Strategic Quiz Success Guide
            </h3>
            <p>
              Master the art of quiz-taking with our proven strategies. Whether you&apos;re 
              preparing for academic tests, competitive exams, or knowledge challenges, 
              these essential tips will help you maximize your performance and achieve 
              better results.
            </p>
            <ul className="mt-6 pl-4 space-y-2">
              <li className="flex gap-2">
                <span className="font-bold text-[#72716f] flex gap-2 mt-1">
                  <FaCircleDot />
                </span>
                Read each question carefully before selecting an answer
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#72716f] flex gap-2 mt-1">
                  <FaCircleDot />
                </span>
                Manage your time wisely - pace yourself through the quiz
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#72716f] flex gap-2 mt-1">
                  <FaCircleDot />
                </span>
                Use the process of elimination for multiple choice questions
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#72716f] flex gap-2 mt-1">
                  <FaCircleDot />
                </span>
                Review your answers before final submission
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#72716f] flex gap-2 mt-1">
                  <FaCircleDot />
                </span>
                Stay focused and maintain a positive mindset
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#72716f] flex gap-2 mt-1">
                  <FaCircleDot />
                </span>
                Learn from each quiz to improve future performance
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full text-black rounded-2xl lg:pt-8 flex flex-col lg:flex-row gap-8 justify-between items-center">
          {/* Success Card */}
          <div data-aos="flip-left" className="w-full lg:w-[30%] bg-gray-100 text-black rounded-2xl p-8">
            <h3 className="text-3xl font-semibold mb-4 text-green-400">
              Success Achieved!
            </h3>
            <p>
              Outstanding work! Your correct answer demonstrates your strong grasp 
              of the subject matter. Each successful response brings you closer to 
              mastering the topic and achieving your learning goals. Keep up this 
              excellent momentum!
            </p>
          </div>

          {/* Center Image */}
          <div className="relative w-full lg:w-[30%] h-[300px]">
            <Image 
              src="https://i.ibb.co.com/GQJ4kLv/6223134.jpg"
              alt="Success illustration"
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          {/* Learning Opportunity Card */}
          <div data-aos="flip-right" className="w-full lg:w-[30%] bg-gray-100 text-black rounded-2xl p-8">
            <h3 className="text-3xl font-semibold mb-4 text-[#ff0000]">
              Better Luck Next!
            </h3>
            <p>
              Don&apos;t worry! Every challenge is a stepping stone to success. Take this 
              moment to understand the correct solution and strengthen your knowledge. 
              Remember, the best quiz-takers learn from their mistakes and come back 
              stronger!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnership;
