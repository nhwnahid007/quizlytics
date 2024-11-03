import React, { useState } from 'react';

const useQuestionNumber = () => {
    const [currentMCQ, setCurrentMCQ] = useState(1);
    return [currentMCQ, setCurrentMCQ];
};

export default useQuestionNumber;