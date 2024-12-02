import React, { useEffect, useState } from 'react';

const useExamId = () => {
    const [examId, setExamId] = useState('');

    useEffect(() => {
        const generateExamId = () => {
            const array = new Uint8Array(8); // Create an array with 8 random bytes
            window.crypto.getRandomValues(array); // Fill array with cryptographically secure random values
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
          }
          
          const examId = generateExamId();
          console.log(examId);
    }, [])

    return [examId, setExamId];
};

export default useExamId;