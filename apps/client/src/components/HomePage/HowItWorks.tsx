"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { BrainCircuit, KeyRound, Link2, Sparkles } from "lucide-react";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

type WorkItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  accent: string;
};

const items: WorkItem[] = [
  {
    icon: BrainCircuit,
    title: "Generate With AI",
    description:
      "Enter topic, level, and question count. Quizlytics prepares a ready-to-practice quiz instantly.",
    accent: "text-primary-color bg-primary-color/10",
  },
  {
    icon: Sparkles,
    title: "Customize Questions",
    description:
      "Review generated items, edit options, and adjust phrasing before you start practice or share with learners.",
    accent: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/30",
  },
  {
    icon: KeyRound,
    title: "Share With Access Key",
    description:
      "Publish private quizzes using quiz keys so classrooms or teams can join only the intended assessment.",
    accent:
      "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/30",
  },
  {
    icon: Link2,
    title: "Convert Article To Quiz",
    description:
      "Paste any article URL and convert reading content into comprehension questions in one click.",
    accent:
      "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/30",
  },
];

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
    });
  }, []);

  return (
    <section className="mx-auto w-[92%] max-w-6xl py-10 md:py-14">
      <SectionTitleMinimal
        heading={"How It Works"}
        subHeading={
          "Create, launch, and review quizzes with a focused workflow"
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <article
            key={item.title}
            data-aos="fade-up"
            data-aos-delay={idx * 80}
            className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.accent}`}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
