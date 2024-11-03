import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';



const useRole = () => {

    const { data: session, error: sessionError, isLoading: sessionLoading } = useSession();
    const user = session?.user;
  
    const { data: role, error: roleError, isLoading: roleLoading } = useQuery({
      queryKey: ["role", user?.email],
      enabled: !!user?.email,
      queryFn: async () => {
        if (!user?.email) {
          return null; // Return null if email is not available
        }
        try {
          const { data } = await axios(`https://quizlytics.jonomukti.org/user/role?email=${user.email}`);
          console.log(data);
  
          return data.role || "user"; // Ensure a valid return value
        } catch (error) {
          console.error("Error fetching user role:", error);
          return null; // Return null in case of an error
        }
      },
    });
  
  

    // Return role, loading, and error states
    return [role, roleLoading, roleError];
};

export default useRole;
