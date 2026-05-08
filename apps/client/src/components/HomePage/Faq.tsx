import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

const Faq = () => {
  return (
    <section className="">
      <div className="container p-4 mx-auto md:p-4  text-gray-800 rounded-lg mb-20 ">
        <SectionTitleMinimal
          heading={"Frequently Asked Questions"}
          subheading={"Answers to common questions about Quizlytics"}
        ></SectionTitleMinimal>

        <Accordion className="w-full space-y-4" type="single" collapsible>
          <AccordionItem
            className="border rounded-lg pl-4 bg-gray-50"
            value="item-1"
          >
            <AccordionTrigger className="font-medium text-lg">
              What is Quizlytics?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              Quizlytics is an all-in-one tool designed for learners in Bangladesh to master MCQs in board exams, job tests, and more. It aims to make learning engaging, personalized, and impactful.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border rounded-lg pl-4 bg-gray-50"
            value="item-2"
          >
            <AccordionTrigger className="font-medium text-lg">
              How can Quizlytics help me track my progress?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              Quizlytics offers features like AI-generated quizzes, custom quizzes, and a leaderboard to help you track your progress and showcase your skills.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border rounded-lg pl-4 bg-gray-50"
            value="item-3"
          >
            <AccordionTrigger className="font-medium text-lg">
              Can teachers create custom quizzes on Quizlytics?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              Yes, teachers and instructors can create, manage, and share custom quizzes seamlessly, simplifying exam administration and enhancing the learning experience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border rounded-lg pl-4 bg-gray-50"
            value="item-4"
          >
            <AccordionTrigger className="font-medium text-lg">
              How does Quizlytics generate quizzes from articles?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              Quizlytics uses advanced AI to create questions based on any provided article link, ensuring comprehension and retention for focused study sessions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border rounded-lg pl-4 bg-gray-50"
            value="item-5"
          >
            <AccordionTrigger className="font-medium text-lg">
              What kind of content can I find in the Quizlytics blog section?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              The blog section offers insightful articles on exams, study strategies, and more, allowing users to engage in valuable discussions and deepen their understanding.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="border rounded-lg pl-4 bg-gray-50"
            value="item-6"
          >
            <AccordionTrigger className="font-medium text-lg">
              How does the Quizlytics leaderboard work?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              The leaderboard tracks your progress and compares your scores with peers, using engaging graphical representations to visualize performance and improvements.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
