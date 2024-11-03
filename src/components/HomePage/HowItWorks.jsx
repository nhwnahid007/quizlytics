"use client"
import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import { PenTool, BrainCircuit, MonitorCog, Link } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import Image from 'next/image';

const CardComponent = ({ imageSrc, altText, title, description }) => (
    <Card data-aos="zoom-in" className="bg-gray-100 rounded-lg shadow-md text-center flex-1">
        <CardHeader className="flex justify-center items-center">
            <Image src={imageSrc} alt={altText} width={100} height={100}></Image>
            <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-gray-600">
                {description}
            </CardDescription>
        </CardContent>
    </Card>
);

const HowItWorks = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000, 
            once: true,
        });
    }, []);

    return (
        <div className="flex flex-col md:flex-row justify-between lg:my-10 p-4 md:mt-0 md:p-8 gap-4 md:gap-8 2xl:gap-12 2xl:p-12">
            <CardComponent 
                imageSrc="https://i.ibb.co.com/jybNXN0/graident-ai-robot-vectorart-78370-4114-removebg-preview.png"
                altText="Create"
                title="AI Generation"
                description="Let AI help you create engaging quizzes automatically from your content or topics of interest."
            />
            <CardComponent 
                imageSrc="https://i.ibb.co.com/qmVtDC4/creative-thinking-concept-illustration-114360-3507-removebg-preview.png"
                altText="Create"
                title="Create"
                description="Quickly create great looking quizzes using multiple question types and formatting options with Quizlytics."
            />
            <CardComponent 
                imageSrc="https://i.ibb.co.com/G2DFbTV/upgrade-concept-illustration-114360-3146-removebg-preview.png"
                altText="Create"
                title="Custom Access"
                description="Control quiz access with unique access keys and create private assessments for specific groups or individuals."
            />
            <CardComponent 
                imageSrc="https://i.ibb.co.com/VJ3PWXc/3d-rendering-interface-icon-23-2151553990-removebg-preview.png"
                altText="Create"
                title="URL to Quiz"
                description="Instantly convert web content into quizzes by simply pasting a URL and letting our AI do the work."
            />
        </div>
    );
};

export default HowItWorks;
