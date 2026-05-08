import { useRouter } from 'next/navigation';
import React from 'react';

const useRouterHook = () => {
    const router = useRouter();
    return router;
};

export default useRouterHook;