import React, { useState } from 'react';

const useMakeExam = () => {
    const [showMakeExam, setShowMakeExam] = useState(true);
    return [showMakeExam, setShowMakeExam];
};

export default useMakeExam;