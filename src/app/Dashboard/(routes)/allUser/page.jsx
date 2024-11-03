"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ClipboardMinus, UserX } from "lucide-react";
import React from "react";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"; // Adjust the import path
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Adjust the import path
import useRole from "@/app/hooks/useRole";
import NotFound from "@/app/not-found";
import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";

const AllUser = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, roleError, roleLoading] = useRole();
  console.log("Role:", role);
  console.log("Role Loading:", roleLoading);
  console.log("Role Error:", roleError);

  const {
    data: users,
    error: userRoleError,
    isLoading: userRoleLoading,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await axios(`https://quizlytics.jonomukti.org/allUsers`);
      return data;
    },
    enabled: role === 'admin', // Only fetch if the role is 'admin'
  });


  if (roleLoading || userRoleLoading) return <div>
  <LoadingSpinner />  
</div>;
if (roleError || userRoleError) return <div>Error loading data</div>;

  if (role !== 'admin') {
     return <NotFound />; 
  }



  const handleDelete = async (email) => {
    try {
      console.log(email);

      const response = await axios.delete(`https://quizlytics.jonomukti.org/deleteUser?email=${email}`);
      if (response.data) {
        toast.success("Deleted successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRoleChange = async (email, newRole) => {
    try {
      const response = await axios.patch(`https://quizlytics.jonomukti.org/updateUserRole`, {
        email,
        role: newRole,
      });
      if (response.data) {
        toast.success("Role updated successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const renderUsers = (role) => {
    return users
      .filter((user) => user.role === role)
      .map((user) => (
        <TableRow key={user.id} className="border-b hover:bg-orange-100">
          <TableCell className="p-3 px-5">
            <span className="bg-transparent min-w-[200px]">{user.name}</span>
          </TableCell>
          <TableCell className="p-3 px-5">
            <span className="bg-transparent">{user.email}</span>
          </TableCell>
          <TableCell className="p-3 px-5">
            <select
              defaultValue={user.role}
              className="bg-transparent border-b border-gray-300 focus:outline-none"
              onChange={(e) => handleRoleChange(user.email, e.target.value)}
            >
              <option value="user">user</option>
              <option value="teacher">teacher</option>
              <option value="admin">admin</option>
            </select>
          </TableCell>
          <TableCell className="flex justify-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="text-sm flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setSelectedUser(user.email)}
                >
                  <span className="text-sm"><UserX /></span> <span className="font-bold">Remove</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user?
                </AlertDialogDescription>
                <AlertDialogAction
                  onClick={() => handleDelete(selectedUser)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                >
                  Confirm
                </AlertDialogAction>
                <AlertDialogCancel asChild>
                  <button className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded">
                    Cancel
                  </button>
                </AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <div className=" min-h-screen max-w-6xl px-2 ">
      <ToastContainer />
      {/* <div className="p-4 flex items-center justify-center">
        <h1 className="text-3xl ">Users</h1>
      </div> */}
      <SectionTitleMinimal heading={"Users"}></SectionTitleMinimal>
      <Tabs defaultValue="user">
        <TabsList className="flex justify-center mb-4"> {/* Center the tabs */}
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <div className="px-3 py-4 flex justify-center">
            <Table className="w-full text-md bg-white shadow-md rounded mb-4">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-left p-3 px-5 min-w-[150px]">Name</TableHead>
                  <TableHead className="text-left p-3 px-5 min-w-[200px]">Email</TableHead>
                  <TableHead className="text-left p-3 px-5">Role</TableHead>
                  <TableHead className="text-left p-3 px-5">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderUsers("user")}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="teacher">
          <div className="px-3 py-4 flex justify-center">
            <Table className="w-full text-md bg-white shadow-md rounded mb-4">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-left p-3 px-5 min-w-[150px]">Name</TableHead>
                  <TableHead className="text-left p-3 px-5 min-w-[200px]">Email</TableHead>
                  <TableHead className="text-left p-3 px-5">Role</TableHead>
                  <TableHead className="text-left p-3 px-5">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderUsers("teacher")}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="admin">
          <div className="px-3 py-4 flex justify-center">
            <Table className="w-full text-md bg-white shadow-md rounded mb-4">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-left p-3 px-5 min-w-[150px]">Name</TableHead>
                  <TableHead className="text-left p-3 px-5 min-w-[200px]">Email</TableHead>
                  <TableHead className="text-left p-3 px-5">Role</TableHead>
                  <TableHead className="text-left p-3 px-5">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderUsers("admin")}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllUser;
