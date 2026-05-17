"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmExitModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeave: () => void;
};

export default function ConfirmExitModal({
  open,
  onOpenChange,
  onLeave,
}: ConfirmExitModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[92vw] max-w-md rounded-2xl border border-gray-200 bg-white p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-gray-950">
            Leave quiz?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-6 text-gray-500">
            Your current progress may be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:space-x-0">
          <AlertDialogCancel className="min-h-11 rounded-xl border-gray-200 px-5 font-bold text-gray-700 hover:bg-gray-100">
            Stay
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onLeave}
            className="min-h-11 rounded-xl bg-red-600 px-5 font-bold text-white hover:bg-red-700"
          >
            Leave Quiz
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
