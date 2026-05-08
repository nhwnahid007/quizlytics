import { useEffect, useState } from "react";

const useExamId = () => {
    const [examId, setExamId] = useState<string>("");

    useEffect(() => {
        const generateExamId = () => {
            const array = new Uint8Array(8); // Create an array with 8 random bytes
            window.crypto.getRandomValues(array); // Fill array with cryptographically secure random values
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
          }
          
          const examId = generateExamId();
          setExamId(examId);
    }, [])

    return [examId, setExamId] as const;
};

export default useExamId;
