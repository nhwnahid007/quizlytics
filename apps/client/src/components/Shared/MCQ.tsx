"use client";
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { QuizQuestion, UserExamAnswer } from "@quizlytics/types";

interface MCQProps {
    currentMCQ: number;
    setCurrentMCQ: Dispatch<SetStateAction<number>>;
    exactMCQ: QuizQuestion | null;
    userExamData: UserExamAnswer[];
    setUserExamData: Dispatch<SetStateAction<UserExamAnswer[]>>;
    examId: string;
    setExamId: Dispatch<SetStateAction<string>>;
    setShowResult: Dispatch<SetStateAction<boolean>>;
}

const EMPTY_OPTIONS: string[] = [];

const MCQ = ({ currentMCQ, setCurrentMCQ, exactMCQ, userExamData, setUserExamData, examId, setExamId, setShowResult }: MCQProps) => {
    const { id, question } = exactMCQ || {};
    const options = exactMCQ?.options ?? EMPTY_OPTIONS;
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [secondsRemaining, setSecondsRemaining] = useState<number>(10); // Countdown from 10 seconds
    const [clickNext, setClickNext] = useState<boolean>(false);

    // Access NextAuth session
    const { data: session } = useSession();
    const name = session?.user?.name;
    const email = session?.user?.email;
    const profile = session?.user?.profile;
    const image = session?.user?.image;

    // Function to generate the examId
    function generateExamId() {
        const array = new Uint8Array(8); 
        window.crypto.getRandomValues(array); 
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    useEffect(() => {
        const generatedExamId = generateExamId();
        setExamId(generatedExamId);
        console.log('Generated Exam ID:', generatedExamId);
    }, [setExamId]);

    // Handle next button
    const handleNext = () => {
        // Only increment if the currentMCQ is less than 9 (to show question numbers 1-10)
        if (currentMCQ < 10) {
            setClickNext(true);
            setCurrentMCQ(currentMCQ + 1);
            setSecondsRemaining(10); // Reset the timer
        } else {
            setShowResult(true); // If it's the last question, show the result
        }
    };

    // Save exam data when 'clickNext' is true or when timer reaches 0
    useEffect(() => {
        const saveExamData = () => {
            const examData = {
                ...(exactMCQ ?? {}),
                examId: examId,
                exam_date: new Date().toISOString(),
                user_answer: selectedAnswer, 
                user_name: name ?? null,
                user_email: email ?? null,
                user_profile: profile || image || null,
                options,
            };
            
            setUserExamData((prevData: UserExamAnswer[]) => {
                const isAlreadyRecorded = prevData.some(item => item.id === examData.id);
                if (!isAlreadyRecorded) {
                    return [...prevData, examData]; // Append new data
                }
                return prevData;
            });
        };

        if (clickNext || secondsRemaining === 0) {
            saveExamData();
            setClickNext(false); // Reset clickNext
        }
    }, [clickNext, secondsRemaining, exactMCQ, selectedAnswer, examId, name, email, profile, image, options, setUserExamData]);

    // Countdown timer for the MCQ
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSecondsRemaining(prevSeconds => {
                if (prevSeconds === 0) {
                    setCurrentMCQ(currentMCQ + 1);
                    return 10; // Reset to 10 seconds for the next question
                }
                return prevSeconds - 1; // Decrease the timer
            });
        }, 1000);
    
        return () => clearInterval(intervalId);
    }, [currentMCQ, setCurrentMCQ]);

    // Handle the selection of an answer
    const handleAnswerSelection = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedAnswer(event.target.value);
    };

    return (
        <div className='p-8 bg-[#ffefd3] rounded-lg'>
            {/* Timer on top */}
            <div className='flex justify-center mb-4'>
                <div className='bg-[#ff0000] p-2 text-white py-3 px-10 rounded-md font-semibold'>
                    <h1 className='text-lg'>
                        {secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining} seconds
                    </h1>
                </div>
            </div>

            {/* MCQ Question */}
            <h3 className='text-lg font-bold mb-4'>
                <span>{currentMCQ}.</span> {question}
            </h3>

            {/* Radio list for options */}
            <div className='radio-section'>
                <div className='radio-list'>
                    {options.map((option, index) => (
                        <div className='radio-item' key={index}>
                            <input
                                type="radio"
                                name="radio"
                                id={`radio${id}-${index}`}
                                value={option}
                                checked={selectedAnswer === option}
                                onChange={handleAnswerSelection}
                                className='hidden peer'
                            />
                            <label htmlFor={`radio${id}-${index}`} className='cursor-pointer'>
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom section with Next button */}
            <div className='flex justify-end items-center mt-6'>
                <Button onClick={handleNext} className='btn bg-[#3db828] px-6 text-white'>
                    Next
                </Button>
            </div>
        </div>
    );
}

export default MCQ;
