import React, { useState } from 'react';

const useUserExamData = () => {
    const [userExamData, setUserExamData] = useState([]);
    return [userExamData, setUserExamData];
};

export default useUserExamData;