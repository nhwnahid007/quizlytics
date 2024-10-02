"use client"
import useRouterHook from '@/app/hooks/useRouterHook';
import useValidationStateHook from '@/app/hooks/useValidationStateHook';
import SocialAuth from '@/components/Shared/SocialAuth';
import { postNewUser } from '@/requests/post';
import axios from 'axios';
import Link from 'next/link';
import React from 'react';
import Swal from 'sweetalert2';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import '../../../../components/Shared/CustomCSS/style.css'
import useShowPassState from '@/app/hooks/useShowPassState';
import useShowConfimPass from '@/app/hooks/useShowConfimPass';

const img_hosting_key = process.env.NEXT_PUBLIC_IMG_HOSTING_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const Register = () => {
    const router = useRouterHook();
    const [showPass, setShowPass] = useShowPassState();
    const [showConfirmPass, setShowConfirmPass] = useShowConfimPass();
    const [validState, setValidState] = useValidationStateHook();

    // validation ralated all errors 
    let nameErr = "Your name is required!";
    let emailErr = "Please enter a valid email!";
    let passErr = "Should be at least 6 characters.";
    let matchedPassErr = "Passwords do not matched!";
    let fillErr = "Upload your profile picture!";

    const handleRegister = async (e) => {
        e.preventDefault();

        // Reset state
        setValidState("");

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirm_password = form.confirm_password.value;
        const profileImgFill = form.my_profile.files[0];

        // check valid email using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Form validation
        if (!name && !email && !password && !confirm_password && !profileImgFill) {
            setValidState("Please fill out all fields!");
            return;
        } else if (!name) {
            setValidState(nameErr);
            return;
        } else if (!email || !emailRegex.test(email)) {
            setValidState(emailErr);
            return;
        } else if (!password || password.length < 6) {
            setValidState(passErr);
            return;
        } else if (password !== confirm_password) {
            setValidState(matchedPassErr);
            return;
        } else if (!profileImgFill) {
            setValidState(fillErr);
        }


        try {
            // upload image to imgbb and get the url
            const formData = new FormData();
            formData.append("image", profileImgFill);
            const imgRes = await axios.post(img_hosting_api, formData);
            const profile = imgRes?.data?.data?.display_url;
            console.log(profile);

            // new user info 
            const newUser = { name, email, password, profile };
            let successfull = false;

            // sending request with newUser data to backend and then to Database if condition satisfy  
            const response = await postNewUser(newUser);
            console.log(response);
            if (response.status === 200) {
                successfull = true;
            }

            // show successfull / failed sweet alert 
            if (successfull) {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Registration Successfull",
                    showConfirmButton: false,
                    timer: 3000,
                    customClass: {
                        popup: 'popup-successfull',
                    }
                });
                e.target.reset();
                router.push('/');
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Already registered!",
                    customClass: {
                        popup: 'popup-failed',
                        confirmButton: 'confirmButton-failed'
                    }
                });
                e.target.reset();
            }

        } catch (error) {
            console.error('registration error', error);
        }

    }

    return (
        <div className='relative h-[200vh] md:h-[170vh] lg:h-[130vh] bg-cover bg-no-repeat bg-center' style={{ backgroundImage: `url('https://i.ibb.co/hyGhyjj/pexels-gnist-706500.jpg')` }}>
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-l from-black via-black/60'>
                <div className='w-[90%] md:max-w-6xl mx-auto py-20 md:flex justify-end'>
                    <div className=''>
                        <h2 className='text-4xl font-bold text-center mb-4 text-[#ffefd3]'>Register Now</h2>
                        <div className='w-full md:w-[580px] bg-[#ffefd3] py-12 px-8 rounded-xl'>
                            <form onSubmit={handleRegister}>
                                <div className="">
                                    <div className='flex flex-col md:flex-row gap-4 mb-6'>
                                        <div className='w-full md:w-1/2 flex flex-col'>
                                            <label className='font-semibold text-black mb-1'>Name</label>
                                            <input type="text" name="name" className='py-3 text-[#ffefd3] text-base font-medium bg-black px-4 rounded-xl' placeholder="Your full name" />
                                            {validState === nameErr && <p className='text-[#ff0000] font-semibold'>{validState}</p>}
                                        </div>
                                        <div className='w-full md:w-1/2 flex flex-col'>
                                            <label className='font-semibold text-black mb-1'>Email</label>
                                            <input type="email" name="email" className='py-3 text-[#ffefd3] text-base font-medium bg-black px-4 rounded-xl' placeholder="Your email" />
                                            {validState === emailErr && <p className='text-[#ff0000] font-semibold'>{validState}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row gap-4 mb-6'>
                                        <div className='w-full md:w-1/2 flex flex-col relative'>
                                            <label className='font-semibold text-black mb-1'>Password</label>
                                            <input type={showPass ? "text" : "password"} name="password" className='py-3 text-[#ffefd3] text-base font-medium bg-black px-4 rounded-xl' placeholder="Password" />
                                            <span onClick={() => setShowPass(!showPass)} className='absolute top-10 right-4 text-xl text-[#ffefd3]  cursor-pointer'>{showPass ? <IoEyeOff /> : <IoEye />}</span>
                                            {validState === passErr && <p className='text-[#ff0000] font-semibold'>{validState}</p>}
                                        </div>
                                        <div className='w-full md:w-1/2 flex flex-col relative'>
                                            <label className='font-semibold text-black mb-1'>Confirm Password</label>
                                            <input type={showConfirmPass ? "text" : "password"} name="confirm_password" className='py-3 text-[#ffefd3] text-base font-medium bg-black px-4 rounded-xl' placeholder="Confirm password" />
                                            <span onClick={() => setShowConfirmPass(!showConfirmPass)} className='absolute top-10 right-4 text-xl text-[#ffefd3] cursor-pointer'>{showConfirmPass ? <IoEyeOff /> : <IoEye />}</span>
                                            {validState === matchedPassErr && <p className='text-[#ff0000] font-semibold'>{validState}</p>}
                                        </div>
                                    </div>
                                    <div className='w-full md:w-1/2 flex flex-col mb-6'>
                                        <label className='font-semibold text-black mb-1'>Upload Profile</label>
                                        <input type="file" name="my_profile" className='py-2 text-[#ffefd3] text-base font-medium bg-black px-4 rounded-xl' />
                                        {validState === fillErr && <p className='text-[#ff0000] font-semibold'>{validState}</p>}
                                    </div>
                                    <button className='btn bg-black text-[#ffefd3] hover:text-black text-lg w-full mt-4'>Register</button>
                                    {validState === "Please fill out all fields!" && <p className='text-[#ff0000] mt-2 text-center font-semibold'>{validState}</p>}
                                    <p className='font-bold text-center py-4 border-b-2 border-black mb-4'></p>
                                </div>
                            </form>
                            <SocialAuth />
                            <p className='mt-4 font-medium '>Already have an account ? <Link href={'/login'} className='text-[#18725d]'>Please Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;