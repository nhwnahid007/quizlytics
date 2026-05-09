"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Share2, QrCode } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareQuizDialogProps {
  quizLink: string;
  quizTitle?: string;
}

export default function ShareQuizDialog({
  quizLink,
  quizTitle,
}: ShareQuizDialogProps) {
  const [copied, setCopied] = useState(false);

  const fullLink =
    typeof window !== "undefined"
      ? `${window.location.origin}${quizLink}`
      : quizLink;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-border hover:bg-primary-color hover:text-white"
        >
          <Share2 className="h-4 w-4" />
          Share Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <QrCode className="h-5 w-5 text-primary-color" />
            Share {quizTitle ? `"${quizTitle}"` : "Quiz"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Link copy section */}
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={fullLink}
              className="flex-1 rounded-xl border border-input bg-muted px-3 py-2 text-sm font-mono truncate"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0 rounded-xl"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Scan this QR code to access the quiz
            </p>
            <div className="p-4 bg-white rounded-2xl shadow-sm border">
              <QRCodeSVG
                value={fullLink}
                size={200}
                level="M"
                bgColor="#ffffff"
                fgColor="#7a1cac"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
