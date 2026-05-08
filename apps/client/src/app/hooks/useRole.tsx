import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserRole } from '@/services/user.service';
import { queryKeys } from '@/lib/query-keys';

const useRole = () => {

    const { data: session } = useSession();
    const user = session?.user;
  
    const { data: role, error: roleError, isLoading: roleLoading } = useQuery({
      queryKey: queryKeys.role(user?.email),
      enabled: !!user?.email,
      queryFn: async () => {
        if (!user?.email) {
          return null; // Return null if email is not available
        }
        const data = await getUserRole(user.email);
        return data?.role || "user";
      },
    });
  
  

    // Return role, loading, and error states
    return [role, roleLoading, roleError] as const;
};

export default useRole;
