import { useState } from "react";

const useValidationStateHook = () => {
  const [validState, setValidState] = useState<string>("");
  return [validState, setValidState] as const;
};

export default useValidationStateHook;
