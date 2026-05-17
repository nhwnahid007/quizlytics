import Image from "next/image";
import React from "react";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

const HelloTeacher = () => {
  return (
    <section className="mx-auto w-[92%] max-w-6xl py-8 md:py-12">
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div>
          <SectionTitleMinimal
            heading={"Hello Teachers"}
            subHeading={
              "Run interactive assessments with clear student insights"
            }
          />

          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            Quizlytics helps you convert lessons into engaging quizzes for
            school, coaching, or university classes. Track participant activity,
            review answer quality, and evaluate time spent per attempt from one
            report-friendly dashboard.
          </p>

          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            Share quizzes with keys, monitor progress in real time, and use
            result history to identify learners who need targeted support.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted/40 p-2">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
              alt="Teacher using quiz analytics dashboard"
              width={1200}
              height={800}
              className="h-auto w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelloTeacher;
