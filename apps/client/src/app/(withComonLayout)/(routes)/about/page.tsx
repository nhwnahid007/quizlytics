import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="bg-gray-50 text-black pt-8">
      <div className="w-full lg:w-[70%] mx-auto py-8 text-center">
        {/* Main Title Section */}
        {/* <h1 className="mt-10 text-4xl md:text-6xl font-bold text-primary-color mb-8">
          Elevate Your Learning with Quizlytics
        </h1> */}
        <SectionTitleMinimal heading={'Elevate Your Learning with Quizlytics'} subHeading={"Where you unlock knowledge, track progress, and ace every challenge."}></SectionTitleMinimal>
        <p className="text-black text-lg md:text-xl mx-4 md:mx-auto leading-relaxed mb-8">
          Welcome to <span className="font-bold">Quizlytics</span>—where you unlock knowledge, track progress, and ace every challenge. Built for learners in Bangladesh, Quizlytics is your all-in-one tool for mastering MCQs in board exams, job tests, and more. Join us to make learning engaging, personalized, and impactful!
        </p>

        {/* Key Features Section */}
        <h2 className="text-4xl font-bold text-primary-color mb-5">Explore Key Features</h2>

        {/* Feature 1 - AI Generated Quizzes */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 py-10 px-5">
          {/* Text Section */}
          <div className="w-full md:w-1/2 md:pr-10 text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary-color mb-3">
              Test your Knowledge with AI-Generated Quizzes
            </h1>
            <p className=" text-gray-700 leading-relaxed">
              Dive into a world of knowledge and challenge yourself with quizzes designed to boost your skills. Powered by AI, our quizzes cover a wide range of topics tailored for students, with different levels based on expertise. Whether you&apos;re preparing for exams or enhancing your knowledge, track your progress and make learning engaging. Start today and see how far you can go!
            </p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <Image 
              width={300}
              height={500}
              src="https://i.ibb.co.com/G94LNJg/ai-nuclear-energy-background-future-innovation-disruptive-technology-53876-129783.jpg" 
              alt="Student holding files" 
              className="w-full h-auto max-h-[500px] object-cover rounded-md shadow-lg" 
            />
          </div>
        </div>

        {/* Feature 2 - Custom Teacher Quizzes */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 py-10 px-5">
          {/* Image Section */}
          <div className="w-full  md:w-1/2 mt-8 md:mt-0 flex justify-center order-2 md:order-1">
            <Image 
              width={300}
              height={500}
              src="https://i.ibb.co.com/Wg90fym/primary-school-teacher-walking-classroom-600nw-2492761215.webp" 
              alt="Instructor pointing to blackboard" 
              className="w-full h-auto max-h-[500px] object-cover rounded-md shadow-lg" 
            />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left order-1 md:order-2">
            <h1 className="text-3xl  font-bold text-primary-color mb-3">
              Custom Quizzes by Teachers or Instructors
            </h1>
            <p className=" text-gray-700 leading-relaxed">
              Empower your teaching with custom quizzes that allow you to create, manage, and share exams seamlessly. With Quizlytics, teachers and instructors can design quizzes tailored to their curriculum and share them through a unique link for students to access. This feature simplifies exam administration, providing an organized way to track student performance while enhancing the overall learning experience. Bring assessments online with ease and let Quizlytics streamline your exam process!
            </p>
          </div>
        </div>

        {/* Article Quiz */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 py-10 px-5">
          {/* Text Section */}
          <div className="w-full md:w-1/2 md:pr-10 text-center md:text-left">
            <h1 className="text-3xl  font-bold text-primary-color mb-3">
              Give quizzes on any article
            </h1>
            <p className=" text-gray-700 leading-relaxed">
              Take customized exams generated just for you! Quizlytics uses advanced AI to create questions based on any provided article link. This feature helps students and professionals alike to review material in a dynamic and engaging way, ensuring comprehension and retention. Simply link an article, and our AI will craft relevant questions that challenge and reinforce your knowledge. Perfect for focused study sessions and content mastery!
            </p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <Image 
              width={300}
              height={500}
              src="https://i.ibb.co.com/WpmdtsT/books-laptop-assortment-23-2149765831.jpg" 
              alt="Student taking exam" 
              className="w-full h-auto max-h-[500px] object-cover rounded-md shadow-lg" 
            />
          </div>
        </div>

        {/* Blogs Part */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 py-10 px-5">
          {/* Image Section */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center order-2 md:order-1">
            <Image 
              width={300}
              height={500}
              src="https://i.ibb.co/58HcqPs/teenage-boy-having-video-call-home-laptop-23-2149332869.jpg" 
              alt="Instructor pointing to blackboard" 
              className="w-full h-auto max-h-[500px] object-cover rounded-md shadow-lg" 
            />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left order-1 md:order-2">
            <h1 className="text-3xl font-bold text-primary-color mb-3">
              Read and Share Insights with Blogs
            </h1>
            <p className=" text-gray-700 leading-relaxed">
              Expand your learning journey by diving into insightful articles or sharing your own knowledge! Quizlytics offers a dynamic blog section where users can read and post blogs covering a variety of topics related to exams, study strategies, and more. This community-driven feature allows students, teachers, and professionals to engage in valuable discussions, stay updated, and deepen their understanding through shared insights. Join the conversation and let your voice be heard!
            </p>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 py-10 px-5">
          {/* Text Section */}
          <div className="w-full md:w-1/2 md:pr-10 text-center md:text-left">
            <h1 className="text-3xl  font-bold text-primary-color mb-3">
              Showcase Your Skills with the Leaderboard
            </h1>
            <p className=" text-gray-700 leading-relaxed">
              Rise to the top with our leaderboard feature! Quizlytics recognizes and celebrates users with the best average results across quizzes. Track your progress and compare your scores with peers to foster a healthy competitive spirit. 
              Results are displayed through engaging graphical representations, making it easy to visualize your performance and improvements. Whether you&apos;re a top performer or just starting, everyone has the chance to shine. Join now and see how your dedication pays off!
            </p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <Image 
              width={300}
              height={500}
              src="https://i.ibb.co.com/S0H557w/leader.png" 
              alt="Leaderboard display" 
              className="w-full h-auto max-h-[500px] object-cover rounded-md shadow-lg" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
