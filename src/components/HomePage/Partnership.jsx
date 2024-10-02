import React from 'react';
import Image from 'next/image';
import { FaCircleDot } from "react-icons/fa6";

const Partnership = () => {
    return (
        <div className='bg-black py-16'>
            <h1 className='text-4xl font-bold text-[#ffefd3] text-center mb-12'>Quiz Rules & Partnerships</h1>
            <div className='w-[90%] md:max-w-6xl mx-auto text'>
                <div className='w-full bg-[#1b1b1b] text-white rounded-2xl p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8'>
                    <div className='relative w-full lg:w-[40%] h-[370px] md:h-[420px]'>
                        <Image
                            src={'https://i.ibb.co.com/8zNHJVt/2121601.jpg'}
                            alt='rules'
                            layout='fill'
                            objectFit='cover'
                            className='rounded-xl'
                        />
                    </div>
                    <div className='w-full lg:w-[60%]'>
                        <h3 className='text-3xl font-semibold mb-4 text-[#f6bd60]'>Quiz Mastery Tricks & Tips</h3>
                        <p>Boost your quiz performance with these smart strategies. From managing your time efficiently to making educated guesses, these tricks will help you navigate through any quiz with confidence. Keep calm, think critically, and remember these key tips to ace your next quiz!</p>
                        <ul className='mt-6 pl-4 space-y-2'>
                            <li className='flex gap-2'><span className='font-bold text-[#f6bd60] flex gap-2 mt-1'><FaCircleDot /></span>Prioritize easier questions first.</li>
                            <li className='flex gap-2'><span className='font-bold text-[#f6bd60] flex gap-2 mt-1'><FaCircleDot /></span>Make educated guesses when necessary.</li>
                            <li className='flex gap-2'><span className='font-bold text-[#f6bd60] flex gap-2 mt-1'><FaCircleDot /></span>Keep a calm and clear mind to avoid mistakes.</li>
                            <li className='flex gap-2'><span className='font-bold text-[#f6bd60] flex gap-2 mt-1'><FaCircleDot /></span>Rule out incorrect answers to improve your chances.</li>
                            <li className='flex gap-2'><span className='font-bold text-[#f6bd60] flex gap-2 mt-1'><FaCircleDot /></span> If unsure, make an educated guess rather than leaving a question blank.</li>
                            <li className='flex gap-2'><span className='font-bold text-[#f6bd60] flex gap-2 mt-1'><FaCircleDot /></span>Don’t spend too long on one question; answer easier ones first, and come back to challenging ones later.</li>

                        </ul>
                    </div>
                </div>
                <div className='w-full text-white rounded-2xl flex flex-col lg:flex-row gap-6'>
                    <div className='w-full lg:w-1/2 bg-[#1b1b1b] text-white rounded-2xl p-8 flex flex-col md:flex-row gap-8'>
                        <div className='relative w-[220px] md:w-[280px] lg:w-[40%] h-[220px]'>
                            <Image
                                src={'https://i.ibb.co.com/zV5bJxR/bid-3815739.png'}
                                alt='rules'
                                layout='fill'
                                objectFit='cover'
                                className='rounded-xl'
                            />
                        </div>
                        <div className='w-full lg:w-[60%]'>
                            <h3 className='text-3xl font-semibold mb-4 text-green-400'>Correct Answer!</h3>
                            <p>Congratulations! You have selected the correct answer. This indicates your knowledge and understanding of the topic. Keep up the great work and continue to build on your success as you progress through the quiz!</p>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 bg-[#1b1b1b] text-white rounded-2xl p-8 flex flex-col md:flex-row gap-8'>
                        <div className='relative w-[220px] md:w-[280px] lg:w-[40%] h-[220px]'>
                            <Image
                                src={'https://i.ibb.co.com/njH26SB/bid-3815750.png'}
                                alt='rules'
                                layout='fill'
                                objectFit='cover'
                                className='rounded-xl'
                            />
                        </div>
                        <div className='w-full lg:w-[60%]'>
                            <h3 className='text-3xl font-semibold mb-4 text-[#ff0000]'>Incorrect Answer!</h3>
                            <p>Oops! That’s not the correct answer. Do not be discouraged; this is a chance to learn. Take a moment to review the question and think about what might be the right choice. Remember, every mistake is an opportunity to improve your knowledge. Keep going!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partnership;