import React, { useEffect, useState } from 'react';

const useDate = () => {
    const [today, setToday] = useState("");

    // Today's date with formatting
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Formats date to YYYY-MM-DD
        console.log("Today:", formattedDate);
        setToday(formattedDate);
    }, []);

    return today;
};

export default useDate;