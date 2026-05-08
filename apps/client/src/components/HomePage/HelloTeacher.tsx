import Image from "next/image";
import React from "react";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

const HelloTeacher = () => {


  return (
    <div className="my-auto mt-10 flex gap-10 flex-col md:text-center lg:text-left md:items-center lg:flex-row p-4 md:p-8 lg:gap-20">
      <div className="flex-1 lg:pl-14">
          <SectionTitleMinimal heading={"Hello Teachers!"} subHeading={"Add Interactivity to your Teaching"}></SectionTitleMinimal>
          
          <p className="text-base text-center md:text-lg mb-2 md:mb-4 opacity-80 ">
            A quiz can teach anything to your students. From primary school to
            university, quizzes make education more engaging and fun. You can also
            test the knowledge of your students and view their results in real time.
            Your quiz automatically records the participants and their answers.
            In the report, you have access to the participants&apos; answers, the
          time they spent on your quiz, and their score.
          </p>
          
      </div>
      <div className="flex-1 flex justify-end items-center lg:pr-14">
        <Image
          src="https://svgshare.com/i/1C9Q.svg"
          alt="Quiz Illustration"
          width={700}
          height={700}
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default HelloTeacher;
