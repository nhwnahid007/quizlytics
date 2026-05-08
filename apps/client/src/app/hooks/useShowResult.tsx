import { useState } from "react";

const useShowResult = () => {
  const [showResult, setShowResult] = useState<boolean>(false);
  return [showResult, setShowResult] as const;
};

export default useShowResult;
