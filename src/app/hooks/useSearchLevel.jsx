import React, { useState } from 'react';

const useSearchLevel = () => {
    const [searchLavel, setSearchLavel] = useState("");
    return [searchLavel, setSearchLavel];
};

export default useSearchLevel;