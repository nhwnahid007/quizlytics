import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

const Faq = () => {
  const items = [
    {
      value: "item-1",
      question: "What is Quizlytics?",
      answer:
        "Quizlytics is an all-in-one tool designed for learners in Bangladesh to master MCQs in board exams, job tests, and more. It aims to make learning engaging, personalized, and impactful.",
    },
    {
      value: "item-2",
      question: "How can Quizlytics help me track my progress?",
      answer:
        "Quizlytics offers features like AI-generated quizzes, custom quizzes, and a leaderboard to help you track your progress and showcase your skills.",
    },
    {
      value: "item-3",
      question: "Can teachers create custom quizzes on Quizlytics?",
      answer:
        "Yes, teachers and instructors can create, manage, and share custom quizzes seamlessly, simplifying exam administration and enhancing the learning experience.",
    },
    {
      value: "item-4",
      question: "How does Quizlytics generate quizzes from articles?",
      answer:
        "Quizlytics uses advanced AI to create questions based on any provided article link, ensuring comprehension and retention for focused study sessions.",
    },
    {
      value: "item-5",
      question:
        "What kind of content can I find in the Quizlytics blog section?",
      answer:
        "The blog section offers insightful articles on exams, study strategies, and more, allowing users to engage in valuable discussions and deepen their understanding.",
    },
    {
      value: "item-6",
      question: "How does the Quizlytics leaderboard work?",
      answer:
        "The leaderboard tracks your progress and compares your scores with peers, using engaging graphical representations to visualize performance and improvements.",
    },
  ];

  return (
    <section>
      <div className="container mx-auto mb-20 rounded-lg p-4 text-foreground md:p-4">
        <SectionTitleMinimal
          heading={"Frequently Asked Questions"}
          subheading={"Answers to common questions about Quizlytics"}
        />

        <Accordion className="w-full space-y-4" type="single" collapsible>
          {items.map(item => (
            <AccordionItem
              key={item.value}
              className="rounded-lg border border-border bg-card px-4 shadow-sm"
              value={item.value}
            >
              <AccordionTrigger className="text-left text-lg font-medium text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pt-2 leading-7 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
