import useDate from '@/app/hooks/useDate';
import useExamId from '@/app/hooks/useExamId';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const MCQ = ({ currentMCQ, setCurrentMCQ, exactMCQ, userExamData, setUserExamData, examId, setExamId, setShowResult }) => {
    const { id, question, options = [] } = exactMCQ || {};
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [clickNext, setClickNext] = useState(false)
    const today = useDate();

    // access next auth session
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

    // handle next button
    const handleNext = () => {
        setClickNext(true);
        setCurrentMCQ(currentMCQ + 1);
        setSecondsElapsed(0);
    }


    // ===================================================================

    // Calculate minutes and seconds for display
    const minutes = Math.floor(secondsElapsed / 60); // Total minutes
    const seconds = secondsElapsed % 60; // Remaining seconds

    useEffect(() => {
        // Function to save the exam data
        const saveExamData = () => {
            const examData = {
                ...exactMCQ,
                examId: examId,
                exam_date: today,
                user_answer: selectedAnswer, 
                user_name: name,
                user_email: email,
                user_profile: profile || image
            };
            
            // Check if the question has already been saved
            setUserExamData(prevData => {
                const isAlreadyRecorded = prevData.some(item => item.id === examData.id);
                if (!isAlreadyRecorded) {
                    return [...prevData, examData]; // Append new data
                }
                return prevData; // Return unchanged data if already saved
            });
        };
        
        // Save data if either 'clickNext' or 'secondsElapsed === 10'
        if (clickNext || secondsElapsed === 10) {
            saveExamData(); // Save the exam data
            setClickNext(false); // Reset clickNext to prevent re-triggering
        }
    }, [clickNext, secondsElapsed, exactMCQ, selectedAnswer, examId, today, name, email, profile, image, setUserExamData]);
    
    // Handle time-based question change
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSecondsElapsed(prevSeconds => {
                // if currentMCQ is more than 10, stop the timer
                if (currentMCQ > 10) {
                    clearInterval(intervalId);
                    setShowResult(true);
                    // return 0;
                }
                // If 10 seconds pass, move to the next question and reset timer
                if (prevSeconds >= 10) {
                    setCurrentMCQ(currentMCQ + 1);
                    return 0;
                }
                return prevSeconds + 1;
            });
        }, 1000);
    
        return () => clearInterval(intervalId);
    }, [currentMCQ, setCurrentMCQ, setShowResult]);

    // Handle the selection of an answer
    const handleAnswerSelection = (event) => {
        setSelectedAnswer(event.target.value);
    };

    console.log(userExamData);
    return (
        <div className='p-8 bg-[#ffefd3] rounded-lg'>
            <h3 className='text-lg font-bold mb-4'><span>{currentMCQ}.</span> {question}</h3>
            {/* Radio list */}
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

            <div className='flex justify-between items-center mt-6'>
                {/* Next & Prev */}
                <div className='flex justify-end'>
                    {/* <button className='btn bg-[#ff2929] px-6 text-white'>Prev</button> */}
                    <button onClick={handleNext} className='btn bg-[#3db828] px-6 text-white'>Next</button>
                </div>
                {/* Timer */}
                <div className='bg-[#001524] p-2 text-white py-3 px-10 rounded-md font-semibold'>
                    <h1 className='text-lg'>
                        {minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default MCQ;
