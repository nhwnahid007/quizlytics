import { useState } from 'react';

const useValidationStateHook = () => {
    const [validState, setValidState] = useState(""); // Initialize state here
    return [validState, setValidState]; // Return the state and the updater function
};

export default useValidationStateHook;