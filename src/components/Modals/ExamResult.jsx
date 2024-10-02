"use client"
import useRouterHook from '@/app/hooks/useRouterHook';
import React from 'react';

const ExamResult = ({ myMark }) => {
    const router = useRouterHook();

    const handleGoHome = () => {
        router.push('/');
    }


    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center'>
            <div className='bg-[#ffefd3] w-[90%] md:w-[580px] p-8 rounded-lg shadow-lg'>
                {/* <h1 className='text-[#008000] font-bold text-center text-3xl mb-4'>Your Mark!</h1> */}
                <div className='w-[200px] h-[200px] mx-auto my-8 border-8 border-[#30d158] p-8 rounded-full flex justify-center items-center'>
                    <h1 className='text-4xl font-bold text-green-600'>{`${myMark} / 10`}</h1>
                </div>
                <h1 className='text-[#30d158] text-center text-4xl'>Your achieved mark !</h1>
                <div className='mt-4 flex justify-center gap-4'>
                    <button onClick={handleGoHome} className='text-red-600 hover:bg-red-600 hover:text-[#ffefd3] font-medium py-2 px-4 border border-red-600 rounded-md'>Exit</button>
                    {/* <button className='text-[#30d158] hover:bg-[#30d158] hover:text-[#ffefd3] font-medium py-2 px-4 border border-[#30d158] rounded-md'>See Results</button> */}
                </div>
            </div>
        </div>
    );
};

export default ExamResult;
