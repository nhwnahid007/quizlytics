import React, { useState } from 'react';

const useSearchCategory = () => {
    const [searchCategory, setSearchCategory] = useState("");
    return [searchCategory, setSearchCategory];
};

export default useSearchCategory;