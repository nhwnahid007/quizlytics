import React from "react";
import Image from "next/image";
import { FaCircleDot } from "react-icons/fa6";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

const Partnership = () => {
  return (
    <section className="py-4">
      <SectionTitleMinimal
        heading={"Master Your Quiz Journey"}
        subHeading={"Unlock your full potential with focused quiz strategies"}
      />
      <div className="mx-auto w-[92%] py-8 md:max-w-6xl">
        <div className="mb-4 flex w-full flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm md:p-8 lg:flex-row lg:gap-6">
          <div className="relative w-full lg:w-[40%] h-[370px] md:h-[420px]">
            <Image
              src={"https://i.ibb.co.com/3dqN05S/2121601-prev-ui.png"}
              alt="rules"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="w-full lg:w-[60%]">
            <h3 className="mb-4 text-3xl font-bold text-primary-color">
              Strategic Quiz Success Guide
            </h3>
            <p className="leading-7 text-muted-foreground">
              Master the art of quiz-taking with proven strategies. Whether
              you&apos;re preparing for academic tests, competitive exams, or
              knowledge checks, these tips help you perform with better focus.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-2">
                <span className="mt-1 flex gap-2 text-primary-color">
                  <FaCircleDot />
                </span>
                Read each question carefully before selecting an answer
              </li>
              <li className="flex gap-2">
                <span className="mt-1 flex gap-2 text-primary-color">
                  <FaCircleDot />
                </span>
                Manage your time wisely - pace yourself through the quiz
              </li>
              <li className="flex gap-2">
                <span className="mt-1 flex gap-2 text-primary-color">
                  <FaCircleDot />
                </span>
                Use the process of elimination for multiple choice questions
              </li>
              <li className="flex gap-2">
                <span className="mt-1 flex gap-2 text-primary-color">
                  <FaCircleDot />
                </span>
                Review your answers before final submission
              </li>
              <li className="flex gap-2">
                <span className="mt-1 flex gap-2 text-primary-color">
                  <FaCircleDot />
                </span>
                Stay focused and maintain a positive mindset
              </li>
              <li className="flex gap-2">
                <span className="mt-1 flex gap-2 text-primary-color">
                  <FaCircleDot />
                </span>
                Learn from each quiz to improve future performance
              </li>
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-col items-stretch justify-between gap-6 rounded-lg text-card-foreground lg:flex-row lg:pt-8">
          {/* Success Card */}
          <div
            data-aos="flip-left"
            className="w-full rounded-lg border border-border bg-card p-6 shadow-sm lg:w-[30%]"
          >
            <h3 className="mb-4 text-2xl font-semibold text-green-600 dark:text-green-400">
              Success Achieved!
            </h3>
            <p className="leading-7 text-muted-foreground">
              Correct responses show strong topic command. Use each successful
              attempt as a signal to raise difficulty and keep momentum.
            </p>
          </div>

          {/* Center Image */}
          <div className="relative w-full lg:w-[30%] h-[300px]">
            <Image
              src="https://i.ibb.co.com/GQJ4kLv/6223134.jpg"
              alt="Success illustration"
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* Learning Opportunity Card */}
          <div
            data-aos="flip-right"
            className="w-full rounded-lg border border-border bg-card p-6 shadow-sm lg:w-[30%]"
          >
            <h3 className="mb-4 text-2xl font-semibold text-red-600 dark:text-red-400">
              Better Luck Next!
            </h3>
            <p className="leading-7 text-muted-foreground">
              Wrong answers are useful signals. Review the explanation, retake
              focused topics, and turn weak areas into practice goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
