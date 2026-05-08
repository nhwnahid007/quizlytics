import { useState } from "react";

const useSearchLevel = () => {
  const [searchLavel, setSearchLavel] = useState<string>("");
  return [searchLavel, setSearchLavel] as const;
};

export default useSearchLevel;
