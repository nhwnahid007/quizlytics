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
import { Button } from "@/components/ui/button";
import type { RegisteredUser } from "@quizlytics/types";

type UserRow = RegisteredUser & { _id?: string };

const AllUser = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [role, roleLoading, roleError] = useRole();
  console.log("Role:", role);
  console.log("Role Loading:", roleLoading);
  console.log("Role Error:", roleError);

  const {
    data: users = [],
    error: userRoleError,
    isLoading: userRoleLoading,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await axios.get<UserRow[]>(`${process.env.NEXT_PUBLIC_API_URL}/allUsers`);
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



  const handleDelete = async (email: string | null) => {
    if (!email) return;
    try {
      console.log(email);

      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteUser?email=${email}`);
      if (response.data) {
        toast.success("Deleted successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/updateUserRole`, {
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

  const renderUsers = (role: string) => {
    return users
      .filter((user: UserRow) => user.role === role)
      .map((user: UserRow) => (
        <TableRow key={user.id ?? user._id ?? user.email} className="border-b hover:bg-gray-100">
          <TableCell className="p-3 px-5">
            <span className="bg-transparent min-w-[200px]">{user.name}</span>
          </TableCell>
          <TableCell className="p-3 px-5">
            <span className="bg-transparent">{user.email}</span>
          </TableCell>
          <TableCell className="p-3 px-5">
            <select
              defaultValue={user.role ?? "user"}
              className="bg-transparent border-b border-gray-300 focus:outline-none"
              onChange={(e) => handleRoleChange(user.email ?? "", e.target.value)}
            >
              <option value="user">user</option>
              <option value="teacher">teacher</option>
              <option value="admin">admin</option>
            </select>
          </TableCell>
          <TableCell className="flex justify-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="buttonOutline"
                  size="sm"
                  className="text-sm flex items-center gap-2"
                  onClick={() => setSelectedUser(user.email ?? null)}
                >
                  <UserX />
                </Button>
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
    <div className=" min-h-screen px-5 lg:mx-20  mx-auto">
      <ToastContainer />
      {/* <div className="p-4 flex items-center justify-center">
        <h1 className="text-3xl ">Users</h1>
      </div> */}
      <SectionTitleMinimal heading={"Users"} subHeading={"Manage all users"}></SectionTitleMinimal>
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
