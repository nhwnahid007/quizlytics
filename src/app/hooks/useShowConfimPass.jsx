import React, { useState } from 'react';

const useShowConfimPass = () => {
    const [showConfirmPass, setShowConfirmPass] = useState(false); // Initialize state here
    return [showConfirmPass, setShowConfirmPass];   // Return the state and the updater function
};

export default useShowConfimPass;