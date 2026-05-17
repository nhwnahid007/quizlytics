"use client";
import { useState, useEffect } from "react";
import Banner from "@/components/HomePage/Banner";
import Overview from "@/components/HomePage/Overview";
import Footer from "@/components/Shared/Footer";
import Feedback from "@/components/HomePage/Feedback";
import Partnership from "@/components/HomePage/Partnership";
import Faq from "@/components/HomePage/Faq";
import HelloTeacher from "@/components/HomePage/HelloTeacher";
import HowItWorks from "@/components/HomePage/HowItWorks";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-color/10 to-transparent" />
        <div className="absolute inset-x-0 top-72 h-px bg-border/70" />
      </div>

      <div className="relative z-10 space-y-2 pb-8">
        <Banner />
        <HowItWorks />
        <HelloTeacher />
        <Overview />
        <Partnership />
        <Feedback />
        <Faq />
      </div>
    </div>
  );
}
