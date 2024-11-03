import React, { useState } from 'react';

const useShowPassState = () => {
    const [showPass, setShowPass] = useState(false); // Initialize state here
    return [showPass, setShowPass];   // Return the state and the updater function
};

export default useShowPassState;