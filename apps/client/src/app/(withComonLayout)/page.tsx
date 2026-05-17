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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground bg-grid-pattern">
      {/* High-Fidelity Ambient Glow Backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft Glowing Radial Blobs */}
        <div className="absolute -top-40 -left-40 h-150 w-150 rounded-full bg-primary-color/8 blur-[120px] opacity-75 dark:bg-primary-color/10" />
        <div className="absolute top-[20%] -right-20 h-125 w-125 rounded-full bg-blue-500/8 blur-[100px] opacity-60 dark:bg-blue-600/10" />
        <div className="absolute bottom-[30%] -left-30 h-137.5 w-137.5 rounded-full bg-emerald-500/4 blur-[120px] opacity-50 dark:bg-emerald-600/5" />
        <div className="absolute bottom-10 right-10 h-112.5 w-112.5 rounded-full bg-purple-500/5 blur-[100px] opacity-45 dark:bg-purple-600/8" />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-96 bg-linear-to-b from-primary-color/10 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-x-0 top-96 h-px bg-border/40" />
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
