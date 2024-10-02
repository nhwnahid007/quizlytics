"use client";
import React, { useEffect, useState } from 'react';
import MCQ from '../Shared/MCQ';

const Questions = ({ currentMCQ, setCurrentMCQ, userExamData, setUserExamData, examId, setExamId, allMCQ, setShowResult={setShowResult} }) => {
    const [exactMCQ, setExactMCQ] = useState([]);

    useEffect(() => {
        const getOneExpected = () => {
            const expectedOne = allMCQ.find((question) => parseInt(question.id) === currentMCQ);
            setExactMCQ(expectedOne);
        }
        getOneExpected();
    }, [allMCQ, currentMCQ])


    console.log(allMCQ);
    console.log(exactMCQ);
    return (
        <div className='w-[90%] md:w-[580px] mx-auto'>
            <MCQ currentMCQ={currentMCQ} setCurrentMCQ={setCurrentMCQ} exactMCQ={exactMCQ} userExamData={userExamData} setUserExamData={setUserExamData} examId={examId} setExamId={setExamId} setShowResult={setShowResult} />
        </div>
    );
};

export default Questions;
