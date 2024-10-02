"use client"
import useRouterHook from '@/app/hooks/useRouterHook';
import { postUserWithProvider } from '@/requests/post';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './CustomCSS/style.css';

const SocialAuth = () => {
    const router = useRouterHook();
    const { data: session, status } = useSession();

    const handleSocialLogin = async (provider) => {
        const resp = await signIn(provider, {redirect: false});
        console.log(resp);
    }
    
    useEffect(() => {
        const postUser = async () => {
            if(status === "authenticated"){
                const name = session?.user?.name;
                const email = session?.user?.email;
                const image = session?.user?.image;
                const newUser = { name, email, image };

                try {
                    const respon = await postUserWithProvider(newUser);
                    console.log(respon.status)
                    if(respon.status === 200){
                        Swal.fire({
                            position: "top-center",
                            icon: "success",
                            title: "New User Successfully Authenticated!",
                            showConfirmButton: false,
                            timer: 4000,
                            customClass: {
                                popup: 'popup-successfull'
                            }
                        });
                        router.push('/');
                    } else if(respon.status === 409) {
                        Swal.fire({
                            position: "top-center",
                            icon: "success",
                            title: "Authentication Successfull!",
                            showConfirmButton: false,
                            timer: 2000,
                            customClass: {
                                popup: 'popup-successfull'
                            }
                        });
                        router.push('/');
                    }
                } catch (error) {
                    console.error('social login error', error);
                }
            }
        }
        postUser();
    }, [router, session?.user?.email, session?.user?.image, session?.user?.name, status])


    return (
        <div>
            <button onClick={() => handleSocialLogin('google')} className='flex justify-center items-center py-3 gap-4 bg-black hover:bg-gray-900 text-[#ffefd3] font-semibold shadow-xl border text-xl mb-2 w-full rounded-lg'>
                <span className="text-2xl"><FaGoogle /></span> Google
            </button>
            <button onClick={() => handleSocialLogin('github')} className='flex justify-center items-center py-3 gap-4 bg-black hover:bg-gray-900 text-[#ffefd3] font-semibold shadow-xl border text-xl mb-2 w-full rounded-lg'>
                <span className="text-2xl"><FaGithub /></span> Github
            </button>
        </div>
    );
};

export default SocialAuth;