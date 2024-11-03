import React, { useState } from 'react';

const useWaiting = () => {
    const [waiting, setWaiting] = useState(true);
    return [waiting, setWaiting];
};

export default useWaiting;