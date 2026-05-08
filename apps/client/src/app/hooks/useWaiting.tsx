import { useState } from "react";

const useWaiting = () => {
  const [waiting, setWaiting] = useState<boolean>(true);
  return [waiting, setWaiting] as const;
};

export default useWaiting;
