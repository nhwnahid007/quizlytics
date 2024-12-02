import React, { useState } from 'react';

const useShowResult = () => {
    const [showResult, setShowResult] = useState(false);
    return [showResult, setShowResult];
};

export default useShowResult;