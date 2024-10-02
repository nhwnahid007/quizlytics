import React from 'react';

const page = () => {
    return (
        // about us
        <div
            className='bg-cover bg-right bg-no-repeat text-center text-white'
            style={{ backgroundImage: `url('https://i.ibb.co/X4fQqDn/question-mark-1872634-1920.jpg')` }}
        >
            {/* Gradient Overlay */}
            <div className='inset-0 bg-gradient-to-r from-black via-black/60 to-transparent'>
                <div className='w-full lg:w-[70%]  mx-auto py-8'>
                    {/* Heading */}
                    <h1 className='text-4xl md:text-6xl text-center font-bold text-[#ff0000] mb-8'>
                        About Quizlytics
                    </h1>

                    {/* Introduction Paragraph */}
                    <p className='text-white text-lg md:text-xl md:mx-auto mx-4 leading-relaxed mb-8'>
                        Welcome to <span className='font-bold'>Quizlytics</span>—your ultimate platform for mastering multiple-choice questions (MCQs) tailored specifically for students and job seekers in Bangladesh. Whether you&apos;re preparing for board exams or aiming for success in job recruitment tests, Quizlytics is here to provide an engaging and effective learning environment.
                        Our platform is designed with the needs of students and competitive exam aspirants in mind, offering a wide range of quiz categories, timed tests, and features that help you track your progress and enhance your knowledge.
                    </p>

                    {/* Detailed Features Section */}
                    <h2 className='text-2xl font-semibold  text-[#ff0000] mb-4'>Key Features</h2>

                    <ul className=' text-white my-7 grid md:grid-cols-2 grid-cols-1 gap-5 md:mx-auto mx-4 text-lg md:text-xl'>
                        <li className='p-4 rounded-md' style={{ backgroundColor: '#1E293B' }}>
                            <strong>🗂️ Quiz Categories:</strong> 
                            <p className='mt-2'>
                                Explore a wide range of quiz categories such as Science, History, Math, and more, all dynamically fetched from the backend. Our quizzes are designed to cover the key subjects relevant to both academic and professional exams in Bangladesh. Each category is easily accessible, allowing you to filter through quizzes with just a click of a button or tab.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#4B5563' }}>
                            <strong>⏳ Timed Quizzes:</strong> 
                            <p className='mt-2'>
                                Every quiz on Quizlytics comes with a configurable time limit, ensuring you get a real exam-like experience. A countdown timer is prominently displayed to keep you aware of the remaining time. As the time nears the end (under 30 seconds), the timer turns red to create a sense of urgency. Once the time runs out, the quiz is automatically submitted, and you are redirected to the results page.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#9CA3AF' }}>
                            <strong>🔄 Limited Quiz Attempts:</strong> 
                            <p className='mt-2'>
                                To ensure fairness and maintain the challenge, each quiz has a limit on the number of attempts. This feature encourages users to thoroughly prepare before attempting quizzes and adds an element of strategy to the learning process. Once you&apos;ve reached the maximum allowed attempts, the quiz becomes inaccessible, helping ensure a balanced competition.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#6B7280' }}>
                            <strong>📊 Quiz History:</strong> 
                            <p className='mt-2'>
                                Track your progress over time with our comprehensive quiz history feature. Each quiz attempt is stored, allowing you to view key details such as your score, time taken, and answers submitted. This feature helps you identify areas for improvement and provides an insightful overview of your learning journey.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#111827' }}>
                            <strong>📈 Instant Results & Detailed Feedback:</strong> 
                            <p className='mt-2'>
                                Get instant results as soon as you complete a quiz. You&apos;ll receive a detailed summary of your performance, including a breakdown of the correct answers and a comparison with your own selections. This immediate feedback helps you identify mistakes and understand the correct solutions.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#374151' }}>
                            <strong>🏅 Badges & Achievements:</strong> 
                            <p className='mt-2'>
                                Motivate yourself with our badge and achievement system! Earn badges for mastering specific quiz topics, achieving top ranks, or completing challenges. All earned badges are proudly displayed in your user profile, encouraging you to strive for new accomplishments and track your progress toward becoming a quiz master.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#1F2937' }}>
                            <strong>📤 Social Sharing:</strong> 
                            <p className='mt-2'>
                                Share your quiz results and achievements with friends and family on popular social media platforms like Facebook, Twitter, and Instagram. This feature promotes friendly competition and encourages others to join the platform and test their knowledge. Social sharing also helps spread the word about Quizlytics and boosts community engagement.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#9CA3AF' }}>
                            <strong>🗣️ Quiz Community Forum:</strong> 
                            <p className='mt-2'>
                                Engage with fellow quiz enthusiasts in our community forum. Here, you can discuss quiz topics, share tips and strategies, and ask questions. The forum fosters a sense of community, allowing users to connect with like-minded individuals and stay motivated throughout their learning journey.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#1E293B' }}>
                            <strong>📝 Articles & Resources:</strong> 
                            <p className='mt-2'>
                                Our platform also features a section dedicated to articles and resources on a wide range of topics. From study tips and exam strategies to insights into quiz trends, our regularly updated content keeps users informed and engaged. Whether you&apos;re preparing for a specific exam or looking to expand your general knowledge, this section offers valuable guidance and support.
                            </p>
                        </li>

                        <li className='p-4 rounded-md' style={{ backgroundColor: '#374151' }}>
                            <strong>📥 User Feedback:</strong> 
                            <p className='mt-2'>
                                We value user feedback at Quizlytics. You can easily share your thoughts, rate quizzes, and provide suggestions to help us improve the platform. Your input is essential in making Quizlytics the best possible tool for your exam preparation.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default page;