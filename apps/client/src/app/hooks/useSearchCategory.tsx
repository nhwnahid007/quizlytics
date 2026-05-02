import { useState } from "react";

const useSearchCategory = () => {
  const [searchCategory, setSearchCategory] = useState<string>("");
  return [searchCategory, setSearchCategory] as const;
};

export default useSearchCategory;
