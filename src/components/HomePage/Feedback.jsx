import Image from 'next/image';
import React from 'react';
import { FaQuoteLeft } from "react-icons/fa";

const Feedback = () => {
    return (
        <div className='bg-[#ffefd3] py-16'>
            <h1 className='text-4xl font-bold text-black text-center mb-12'>Feedback & Reviews</h1>
            <div className='w-[90%] md:max-w-6xl mx-auto flex justify-center'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {
                        feedbackData.map(item => (
                            <div key={item.name} className='w-full   bg-black p-6 rounded-xl'>
                                <Image
                                    src={item.user}
                                    alt='feedback'
                                    width={140}
                                    height={140}
                                    className='rounded-full mx-auto mt-4'
                                />
                                <div>
                                    <h2 className='text-xl font-semibold text-white text-center mt-4'>{item.name}</h2>
                                    <p className='text-white my-4 italic flex gap-2'><span><FaQuoteLeft /></span>{item.description}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

const feedbackData = [
    {
        "user": "https://i.ibb.co.com/LpCLJ6t/04-unsplash.png",
        "name": "Ahmed Zubayer",
        "description": "This app is awesome! The quizzes are fun, and the variety of topics keeps it interesting. Perfect for passing time while learning something new."
    },
    {
        "user": "https://i.ibb.co.com/Srzp6qk/01-unsplash.png",
        "name": "Julkarnine Sayer",
        "description": "The app is well-designed, and the leaderboard adds a competitive edge. It’s great to compete with friends and see who knows more."
    },
    {
        "user": "https://i.ibb.co.com/cNhTxpw/02-unsplash.png",
        "name": "Kamal Ataturk",
        "description": "Super engaging quizzes with a smooth interface. I’ve learned so much while having fun. Plus, the achievements system is a nice touch!"
    }
    // {
    //     "user": "https://i.ibb.co.com/3Yzcp0W/03-Unsplash.png",
    //     "name": "Tahsen Kabir",
    //     "description": "A great app to sharpen your brain! The timed quizzes make it challenging, and I really enjoy the different difficulty levels."
    // },
    // {
    //     "user": "https://i.ibb.co.com/fkTcxpf/13-unsplash.png",
    //     "name": "Abu Sufian Kabbo",
    //     "description": "This app is a hidden gem. I’ve been hooked ever since I downloaded it. The range of topics is impressive, and it’s really easy to use!"
    // },
    // {
    //     "user": "https://i.ibb.co.com/8zfmYkj/09-unsplash.png",
    //     "name": "Mujahid Shanto",
    //     "description": "I love the challenge of beating the timer. It’s a great way to test your knowledge and improve your speed. Highly recommend!"
    // }
]

export default Feedback;