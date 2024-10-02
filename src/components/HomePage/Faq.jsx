import React from "react";

const Faq = () => {
  return (
    <section className="dark:bg-gray-100 dark:text-gray-800 bg-black">
      <div className="container flex flex-col justify-center px-4 py-8 mx-auto md:p-8 bg-black text-white">
        <h2 className="text-2xl font-semibold sm:text-4xl mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <details className="w-full border rounded-lg">
            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-600">
              Can I retake a quiz?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 dark:text-gray-600">
              Yes, you can retake quizzes as many times as you like to improve
              your score.{" "}
            </p>
          </details>
          <details className="w-full border rounded-lg">
            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-600">
              Is there a time limit for each quiz?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 dark:text-gray-600">
              Yes, most quizzes have a time limit to add an extra challenge, but
              it varies depending on the quiz topic.{" "}
            </p>
          </details>
          <details className="w-full border rounded-lg">
            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-600">
              How is my score calculated?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 dark:text-gray-600">
              Each correct answer earns you points, and your final score is the
              sum of all correct responses. There are no penalties for incorrect
              answers.{" "}
            </p>
          </details>
          <details className="w-full border rounded-lg">
            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-600">
              Are there backend-focused quizzes?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 dark:text-gray-600">
              Yes! We offer quizzes on MongoDB, Firebase, and Express, covering
              database management, authentication, and server-side logic.{" "}
            </p>
          </details>
          <details className="w-full border rounded-lg">
            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-600">
              How difficult is the React quiz?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 dark:text-gray-600">
              The React quiz is designed for both beginners and intermediate
              learners, covering topics like components, state management,
              hooks, lifecycle methods, and JSX.{" "}
            </p>
          </details>
          <details className="w-full border rounded-lg">
            <summary className="px-4 py-6 focus:outline-none focus-visible:dark:ring-violet-600">
              What can I expect in the CSS quiz?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 dark:text-gray-600">
              The CSS quiz includes questions on selectors, layout models
              (Flexbox, Grid), animations, responsiveness, and more.{" "}
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default Faq;
