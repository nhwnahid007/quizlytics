import { useState } from "react";

const useLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);
  return [loading, setLoading] as const;
};

export default useLoading;
