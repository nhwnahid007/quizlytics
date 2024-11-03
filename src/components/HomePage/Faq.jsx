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
      <div className="container p-4 mx-auto md:p-4  text-gray-800 rounded-lg ">
        
          <SectionTitleMinimal heading={"Frequently Asked Questions"} subheading={"Answers to common questions"}></SectionTitleMinimal>
       

        <Accordion className="w-full space-y-4" type="single" collapsible>
          <AccordionItem className="border rounded-lg pl-4 bg-gray-50" value="item-1">
            <AccordionTrigger className="font-medium text-lg">Can I retake a quiz?</AccordionTrigger>
            <AccordionContent className="pt-2">
              Yes, you can retake quizzes as many times as you like to improve your score.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border rounded-lg pl-4 bg-gray-50" value="item-2">
            <AccordionTrigger className="font-medium text-lg">
              Is there a time limit for each quiz?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              Yes, most quizzes have a time limit to add an extra challenge, but it varies depending on the quiz topic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border rounded-lg pl-4 bg-gray-50" value="item-3">
            <AccordionTrigger className="font-medium text-lg">How is my score calculated?</AccordionTrigger>
            <AccordionContent className="pt-2">
              Each correct answer earns you points, and your final score is the sum of all correct responses. There are no penalties for incorrect answers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border rounded-lg pl-4 bg-gray-50" value="item-4">
            <AccordionTrigger className="font-medium text-lg">
              Are there backend-focused quizzes?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              Yes! We offer quizzes on MongoDB, Firebase, and Express, covering database management, authentication, and server-side logic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border rounded-lg pl-4 bg-gray-50" value="item-5">
            <AccordionTrigger className="font-medium text-lg">
              How difficult is the React quiz?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              The React quiz is designed for both beginners and intermediate learners, covering topics like components, state management, hooks, lifecycle methods, and JSX.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border rounded-lg pl-4 bg-gray-50" value="item-6">
            <AccordionTrigger className="font-medium text-lg">
              What can I expect in the CSS quiz?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              The CSS quiz includes questions on selectors, layout models (Flexbox, Grid), animations, responsiveness, and more.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
