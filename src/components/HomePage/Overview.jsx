import Image from 'next/image';
import React from 'react';

const Overview = () => {
    return (
        <div className='py-14 bg-black'>
            <div className='w-[90%] md:max-w-6xl mx-auto'>
                <h1 className='text-4xl font-bold text-[#ffefd3] text-center'>Activities Overview</h1>
                {/* Trending Topics & Question Type */}
                <div className='flex flex-col md:flex-row gap-12 mt-12'>
                    <div className='w-full md:w-[65%] bg-[#1b1b1b] text-white rounded-2xl p-8'>
                        <h2 className='text-3xl font-bold pb-2 mb-4'>Trending Topics</h2>
                        <div className='flex gap-2 items-end overflow-x-auto'>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[140px] rounded-xl'></div>
                                <span>Geo</span>
                            </div>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[180px] rounded-xl'></div>
                                <span>Math</span>
                            </div>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[220px] rounded-xl'></div>
                                <span>Hist</span>
                            </div>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[200px] rounded-xl'></div>
                                <span>Chem</span>
                            </div>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[160px] rounded-xl'></div>
                                <span>Phys</span>
                            </div>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[180px] rounded-xl'></div>
                                <span>CSE</span>
                            </div>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[170px] rounded-xl'></div>
                                <span>Art</span>
                            </div>
                            <div className='w-20'>
                                <div className='bg-white w-14 h-[210px] rounded-xl'></div>
                                <span>Eng</span>
                            </div>
                        </div>
                    </div>
                    <div className='w-full md:w-[35%] bg-[#1b1b1b] text-white rounded-2xl p-8'>
                        <h2 className='text-3xl font-bold border-b-2 border-white pb-2 mb-8'>Question Type</h2>
                        <h3 className='text-xl font-semibold'>What is the capital city of France?</h3>
                        <ul className='mt-3 space-y-2'>
                            <li className='bg-[#202020] py-2 px-4 rounded-xl shadow-sm shadow-black'>{`A) Berlin`}</li>
                            <li className='bg-[#202020] py-2 px-4 rounded-xl shadow-sm shadow-black'>{`B) Madrid`}</li>
                            <li className='bg-[#202020] py-2 px-4 rounded-xl shadow-sm shadow-black'>{`C) Paris`}</li>
                            <li className='bg-[#202020] py-2 px-4 rounded-xl shadow-sm shadow-black'>{`D) Rome`}</li>
                        </ul>
                    </div>
                </div>

                {/* Achievement */}
                <div className='flex flex-col lg:flex-row gap-8 mt-8'>
                    <div className='w-full lg:w-1/2 bg-[#1b1b1b] text-white rounded-2xl p-8'>
                        <div className='flex flex-col md:flex-row gap-8'>
                            <div className='relative w-[120px] h-[120px] md:w-[500px] md:h-[104px]'>
                                    <Image src={'https://i.ibb.co/S36XTTY/schedule-3652191.png'}
                                        alt='achievment'
                                        layout='fill'
                                        objectFit='cover'
                                    />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold mb-4'>Time</h1>
                                <p>In QuizApp, each quiz has a time limit, challenging users to answer quickly and accurately. The timer adds excitement and tests quick thinking skills. Completing quizzes within the allotted time enhances decision-making skills while fostering a sense of urgency and excitement.</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 bg-[#1b1b1b] text-white rounded-2xl p-8'>
                        <div className='flex flex-col md:flex-row gap-8'>
                            <div className='relative w-[120px] h-[120px] md:w-[500px] md:h-[104px]'>
                                    <Image src={'https://i.ibb.co/wWN0M1T/badge-2583264.png'}
                                        alt='achievment'
                                        layout='fill'
                                        objectFit='cover'
                                    />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold mb-4'>Achievement</h1>
                                <p>A Quiz Win Achievement marks success in mastering quiz topics. It reflects knowledg and effort, boosting confidence and encouraging further engagement with quizzes. It’s a recognition of intellectual growth and accomplishment in the quiz community.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;