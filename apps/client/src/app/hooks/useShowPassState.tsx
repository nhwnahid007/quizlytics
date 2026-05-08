import { useState } from "react";

const useShowPassState = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  return [showPass, setShowPass] as const;
};

export default useShowPassState;
