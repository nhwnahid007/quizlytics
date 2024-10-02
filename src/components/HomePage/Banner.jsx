"use client"
import useRouterHook from '@/app/hooks/useRouterHook';
import Image from 'next/image';
import React from 'react';

const Banner = () => {
    const router = useRouterHook();
    const handleQuicktExam = () => {
        router.push('/exam');
    }

    return (
        <div className='relative h-[130vh] lg:h-[90vh] bg-cover bg-right bg-no-repeat text-white'
            style={{ backgroundImage: `url('https://i.ibb.co.com/X4fQqDn/question-mark-1872634-1920.jpg')` }}
        >
            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-black via-black/50'>
                <div className='relative z-10 flex flex-col lg:flex-row justify-between gap-8 px-8 md:px-20 pt-20'>
                    <div className='w-full lg:w-[70%] md:pr-32'>
                        <div className='w-full md:w-[683px]'>
                            <h1 className='text-3xl md:text-5xl font-bold text-[#ff0000] mb-4 md:pr-20'>Challenge Your Mind with Fun Quizzes</h1>
                            <p className='text-white'>Explore a wide range of engaging and interactive quizzes designed to test your knowledge across various topics. Track your progress, compete with friends, and see how you rank on leaderboards. From general knowledge to niche subjects, there is a quiz for everyone. Dive in and discover how much you really know!</p>
                            <div className='flex gap-4 mt-8'>
                                <button onClick={handleQuicktExam} className="px-6 md:px-12 py-4 rounded-xl font-semibold bg-[#ff0000] hover:bg-[#ffefd3] text-white hover:text-black">Quick Exam</button>
                                <button className="px-6 md:px-12 py-4 rounded-xl font-semibold bg-[#ffefd3] hover:bg-[#ff0000] text-black hover:text-white">Top Results</button>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:w-[30%] flex lg:justify-center items-center'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='relative w-[140px] h-[130px] bg-[#c0c0c0] text-black flex justify-center items-center rounded-2xl'>
                                <Image
                                    src={'https://i.ibb.co/ZXGbZfZ/blackboard-5745341.png'}
                                    alt='icons'
                                    layout='fill'
                                    objectFit='cover'
                                    className='p-6'
                                />
                            </div>
                            <div className='relative w-[140px] h-[130px] bg-[#ffefd3] text-black flex justify-center items-center rounded-2xl'>
                                <Image
                                    src={'https://i.ibb.co/ZdG5wcN/engineering-5745406.png'}
                                    alt='icons'
                                    layout='fill'
                                    objectFit='cover'
                                    className='p-6'
                                />
                            </div>
                            <div className='relative w-[140px] h-[130px] bg-[#ffefd3] text-black flex justify-center items-center rounded-2xl'>
                                <Image
                                    src={'https://i.ibb.co/wRrFH2y/magnifing-glass-12337176.png'}
                                    alt='icons'
                                    layout='fill'
                                    objectFit='cover'
                                    className='p-6'
                                />
                            </div>
                            <div className='relative w-[140px] h-[130px] bg-[#c0c0c0] text-black flex justify-center items-center rounded-2xl'>
                                <Image
                                    src={'https://i.ibb.co/C0g5gtj/analytics-5745493.png'}
                                    alt='icons'
                                    layout='fill'
                                    objectFit='cover'
                                    className='p-6'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;