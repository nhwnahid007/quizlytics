"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitleMinimal } from "../Shared/SectionTitle";
import type { FeedbackRecord } from "@/types/client";
import { getAllFeedback } from "@/services/quiz.service";

const Feedback = () => {
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const autoplay = Autoplay({ delay: 3000 });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await getAllFeedback();
        setFeedback(response as FeedbackRecord[]);
      } catch {
        setFeedback([]);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <section className="mt-4 overflow-hidden pb-12">
      <SectionTitleMinimal
        heading={"Feedback & Reviews"}
        subHeading={"What learners and teachers say about Quizlytics"}
      />

      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[autoplay]}
        className="mx-auto w-full max-w-5xl"
      >
        <CarouselContent className="flex justify-center md:justify-start -ml-1">
          {feedback.map((item: FeedbackRecord, index: number) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1 flex justify-center items-center">
                <Card className="relative h-80 w-80 overflow-hidden border-l-4 border-l-primary-color bg-card p-3 shadow-sm">
                  <div className="flex items-center p-4">
                    <div className="w-16 h-16 bg-primary-color rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item?.image ? (
                        <Image
                          src={item.image}
                          alt="feedback"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-bold text-foreground">
                        {item.name || "Anonymous"}
                      </h2>
                      <p className="text-muted-foreground">
                        {item.designation || "Teacher"}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-justify text-sm italic leading-6 text-muted-foreground">
                      {item.message || "No feedback provided"}
                    </p>
                  </CardContent>
                  <div className="absolute right-2 top-2 rounded-lg bg-primary-color p-2 text-primary-foreground shadow-sm">
                    <div className="flex gap-0.5">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <FaStar key={i} className="text-[#F3C623] w-3 h-3" />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default Feedback;
