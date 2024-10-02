"use client"
import useMakeExam from '@/app/hooks/useMakeExam';
import React from 'react';

const Loading = ({setShowLoading}) => {

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center'>
            <h1 className='text-4xl text-black font-medium'>Question in processing.....</h1>
        </div>
    );
};

export default Loading;
