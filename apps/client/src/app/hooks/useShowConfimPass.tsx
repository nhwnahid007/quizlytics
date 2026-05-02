import { useState } from "react";

const useShowConfimPass = () => {
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  return [showConfirmPass, setShowConfirmPass] as const;
};

export default useShowConfimPass;
