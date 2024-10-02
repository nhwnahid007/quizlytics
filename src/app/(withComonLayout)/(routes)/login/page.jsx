"use client"
import Link from 'next/link';
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import SocialAuth from '@/components/Shared/SocialAuth';
import useShowPassState from '@/app/hooks/useShowPassState';
import useValidationStateHook from '@/app/hooks/useValidationStateHook';

const Login = () => {
    const { data: session, status } = useSession();
    const [showPass, setShowPass] = useShowPassState();
    const [validState, setValidState] = useValidationStateHook();

    const handleLogin = async (e) => {
        e.preventDefault();

        // reset state
        setValidState("");

        const email = e.target.email.value;
        const password = e.target.password.value;
        if (isNaN(password)) {
            setValidState("Close Eye icon in the password field")
        }

        const response = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (response.status === 401) {
            setValidState("Invalid User!");
        }
    }


    return (
        <div className='relative h-[140vh] lg:h-[110vh] bg-cover bg-no-repeat bg-center m-0' style={{ backgroundImage: `url('https://i.ibb.co/hyGhyjj/pexels-gnist-706500.jpg')`, marginBottom: '0' }}>
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-l from-black via-black/60 h-full'>
                <div className='w-[90%] md:max-w-6xl mx-auto py-12 md:flex justify-end h-full'>
                    <div>
                        <h2 className='text-4xl font-bold text-center mb-6 text-[#ffefd3]'>Login Here</h2>
                        <div className='w-full md:w-[480px] bg-[#ffefd3] py-16 px-8 rounded-xl'>
                            <form onSubmit={handleLogin}>
                                <div className='space-y-4'>
                                    <div className='w-full flex flex-col'>
                                        <input type="email" name='email' className='py-3 text-[#ffefd3] text-lg bg-black px-4 rounded-xl' placeholder='Email address' />
                                    </div>
                                    <div className='w-full flex flex-col relative'>
                                        <input type={showPass ? "text" : "password"} name='password' className='py-3 text-[#ffefd3] text-lg bg-black px-4 rounded-xl' placeholder='Your password' />
                                        <span onClick={() => setShowPass(!showPass)} className='absolute top-4 right-6 text-xl text-[#ffefd3]  cursor-pointer'>{showPass ? <IoEyeOff /> : <IoEye />}</span>
                                    </div>
                                </div>
                                <button className='btn bg-black text-[#ffefd3] hover:text-black text-lg mt-6 w-full'>Login</button>
                                {validState === "Invalid User!" && <p className='text-[#ff0000] mt-2 text-center font-semibold'>{validState}</p>}
                                <p className='font-bold text-center py-4 border-b-2 border-black mb-4'></p>
                            <SocialAuth />
                            </form>
                            <p className='font-bold text-center py-2 border-b-2 border-black mb-4'></p>
                            <div className="flex justify-center">
                                <Link href="/register"><button className="btn bg-black text-white">Create a new account</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
