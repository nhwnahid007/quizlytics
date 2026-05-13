"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Pencil,
  Check,
  X,
  Trophy,
  Target,
  Activity,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMarks } from "@/requests/get";
import type { HistoryWithMongoId } from "@/requests/get";
import { apiClient } from "@/lib/api-client";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import moment from "moment/moment";
import { toast } from "sonner";

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<HistoryWithMongoId[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  const user = session?.user;
  const email = user?.email ?? "";
  const name = user?.name ?? "";

  useEffect(() => {
    setDisplayName(name);
  }, [name]);

  useEffect(() => {
    const fetchData = async () => {
      if (!email) return;
      try {
        const data = await getMarks(email);
        setHistory(data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  const handleSaveName = async () => {
    if (!displayName.trim() || displayName === name) {
      setEditingName(false);
      return;
    }
    setSaving(true);
    try {
      await apiClient.patch("/user/displayName", {
        email,
        name: displayName.trim(),
      });
      toast.success("Display name updated!");
      setEditingName(false);
    } catch {
      toast.error("Failed to update display name");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const totalQuizzes = history.length;
  const avgScore =
    totalQuizzes > 0
      ? (
          history.reduce((acc, h) => acc + (h.marks ?? 0), 0) / totalQuizzes
        ).toFixed(1)
      : "0";
  const bestScore =
    totalQuizzes > 0 ? Math.max(...history.map(h => h.marks ?? 0)) : 0;
  const recentActivity = history.slice(0, 5);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-500/20">
              {getInitials(displayName || name)}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b-2 border-primary-color outline-none text-foreground"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveName}
                      disabled={saving}
                      className="h-8 w-8"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setDisplayName(name);
                        setEditingName(false);
                      }}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-foreground">
                      {displayName || name || "User"}
                    </h1>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingName(true)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                <Clock className="inline h-3 w-3 mr-1" />
                Member since {moment(new Date()).format("MMMM YYYY")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Quizzes",
              value: totalQuizzes,
              icon: Activity,
              color: "bg-blue-500",
            },
            {
              label: "Average Score",
              value: `${avgScore}%`,
              icon: Target,
              color: "bg-primary-color",
            },
            {
              label: "Best Score",
              value: `${bestScore}%`,
              icon: Trophy,
              color: "bg-yellow-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div
                className={`${stat.color} p-3 rounded-xl text-white shadow-lg w-fit mb-3`}
              >
                <stat.icon size={20} />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No quiz activity yet. Take your first quiz!
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(item => {
                const score = item.marks ?? 0;
                const color =
                  score > 70
                    ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                    : score >= 40
                      ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                      : "text-red-600 bg-red-50 dark:bg-red-900/20";
                return (
                  <div
                    key={item._id ?? item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {item.quizCategory || item.quizTitle || "Quiz"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {moment(item.date).format("MMM Do, YYYY")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}
                    >
                      {score}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
