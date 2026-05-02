"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
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

const Feedback = () => {
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const autoplay = Autoplay({ delay: 3000 });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get<FeedbackRecord[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/all-feedback`
        );
        setFeedback(response.data);
      } catch (err: unknown) {
        console.error(err);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className=" overflow-hidden mt-4 pb-12">
     <SectionTitleMinimal heading={"Feedback & Reviewss"} subHeading={"What our clients say about us"} ></SectionTitleMinimal>

      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[autoplay]}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent className="flex justify-center md:justify-start -ml-1">
          {feedback.map((item: FeedbackRecord, index: number) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1 flex justify-center items-center">
                <Card className="relative p-3 bg-white shadow-lg rounded-lg overflow-hidden w-80 h-80 border-l-4 border-primary-color">
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
                      <h2 className="text-lg font-bold text-black">{item.name || 'Anonymous'}</h2>
                      <p className="text-gray-600">{item.designation || "Teacher"}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="italic text-gray-600 text-justify">
                      {item.message || "No feedback provided"}
                    </p>
                  </CardContent>
                  <div className="absolute top-1 right-1 bg-primary-color opacity-80 text-white rounded-lg p-2">
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
    </div>
  );
};

export default Feedback;
