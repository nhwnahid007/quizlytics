import { useState } from 'react';

const useAllMCQ = (initialState = []) => {
    const [allMCQ, setAllMCQ] = useState(initialState);
    return [allMCQ, setAllMCQ];
};

export default useAllMCQ;