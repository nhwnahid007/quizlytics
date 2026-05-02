import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface RoleResponse {
  role?: string;
}

const useRole = () => {

    const { data: session } = useSession();
    const user = session?.user;
  
    const { data: role, error: roleError, isLoading: roleLoading } = useQuery({
      queryKey: ["role", user?.email],
      enabled: !!user?.email,
      queryFn: async () => {
        if (!user?.email) {
          return null; // Return null if email is not available
        }
        try {
          const { data } = await axios.get<RoleResponse>(`${process.env.NEXT_PUBLIC_API_URL}/user/role?email=${user.email}`);
          console.log(data);
  
          return data.role || "user"; // Ensure a valid return value
        } catch (error) {
          console.error("Error fetching user role:", error);
          return null; // Return null in case of an error
        }
      },
    });
  
  

    // Return role, loading, and error states
    return [role, roleLoading, roleError] as const;
};

export default useRole;
