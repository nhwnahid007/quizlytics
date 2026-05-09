"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Crown, Medal, Trophy } from "lucide-react";
import { getExaminees } from "@/requests/get";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { SectionTitleMinimal } from "./SectionTitle";
import type { HistoryWithMongoId } from "@/requests/get";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";

interface Leader {
  userEmail: string;
  marks: number;
  count: number;
  userName?: string | null;
  userImg?: string | null;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const MEDAL_COLORS = [
  { bg: "bg-yellow-400", text: "text-yellow-900", border: "ring-yellow-400", icon: "text-yellow-300" },
  { bg: "bg-gray-300", text: "text-gray-800", border: "ring-gray-300", icon: "text-gray-300" },
  { bg: "bg-amber-600", text: "text-amber-100", border: "ring-amber-600", icon: "text-amber-500" },
];

const Leaders = () => {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [allData, setAllData] = useState<HistoryWithMongoId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<"week" | "all">("all");

  useEffect(() => {
    const getAllExaminees = async () => {
      try {
        const data = await getExaminees();
        setAllData(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while fetching leaderboard data!",
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };
    getAllExaminees();
  }, []);

  useEffect(() => {
    let filteredData = allData;
    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredData = allData.filter((d) => new Date(d.createdAt) >= weekAgo);
    }

    const examineeMap = filteredData.reduce<Record<string, Leader>>((acc, examinee: HistoryWithMongoId) => {
      const { userEmail, marks } = examinee;
      const email = userEmail ?? "unknown";
      if (!acc[email]) {
        acc[email] = { userEmail: email, marks: 0, count: 0, userName: examinee.userName, userImg: examinee.userImg };
      }
      acc[email].marks += marks ?? 0;
      acc[email].count += 1;
      return acc;
    }, {});

    const averaged = Object.values(examineeMap)
      .map((e) => ({
        ...e,
        marks: Number((e.marks / e.count).toFixed(2)),
      }))
      .sort((a, b) => b.marks - a.marks)
      .slice(0, 10);

    setLeaders(averaged);
  }, [allData, timeFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const topThree = leaders.slice(0, 3);
  const remainingLeaders = leaders.slice(3);

  const renderAvatar = (leader: Leader, size: number, ringColor?: string) => {
    if (leader.userImg) {
      return (
        <Image
          src={leader.userImg}
          alt={leader.userName ?? "Player"}
          width={size}
          height={size}
          className={`rounded-full max-w-full max-h-full ${ringColor ? `ring-2 ${ringColor}` : ""}`}
        />
      );
    }
    return (
      <div
        className={`w-full h-full rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold ${ringColor ? `ring-2 ${ringColor}` : ""}`}
        style={{ fontSize: size * 0.35 }}
      >
        {getInitials(leader.userName)}
      </div>
    );
  };

  return (
    <div className="lg:p-8 p-4 rounded-lg max-w-3xl mx-auto">
      <SectionTitleMinimal heading="LEADERBOARD" subHeading="Recognizing Excellence" />
      
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as "week" | "all")}>
          <TabsList className="bg-muted rounded-xl">
            <TabsTrigger value="week" className="rounded-lg px-6 data-[state=active]:bg-primary-color data-[state=active]:text-white">
              This Week
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg px-6 data-[state=active]:bg-primary-color data-[state=active]:text-white">
              All Time
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-purple-600 lg:p-8 p-4 rounded-2xl">
        {leaders.length === 0 ? (
          <div className="text-center py-12 text-white/70">
            <Medal className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No leaderboard data for this period</p>
          </div>
        ) : (
          <>
            {/* Top 3 Players */}
            <div className="flex bg-purple-600 pt-4 justify-center items-end lg:gap-8 gap-4 mb-12">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className={`text-center ${currentUserEmail === topThree[1].userEmail ? "ring-2 ring-white/50 rounded-2xl p-3 bg-white/10" : ""}`}>
                  <div className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center sm:w-12 sm:h-12 overflow-hidden">
                    {renderAvatar(topThree[1], 64)}
                  </div>
                  <p className="text-white font-semibold text-sm">{topThree[1].userName}</p>
                  <p className="text-yellow-300 font-bold">{topThree[1].marks}%</p>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${MEDAL_COLORS[1].bg} ${MEDAL_COLORS[1].text} text-sm font-bold mt-2`}>
                    🥈
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className={`text-center -mt-8 ${currentUserEmail === topThree[0].userEmail ? "ring-2 ring-white/50 rounded-2xl p-3 bg-white/10" : ""}`}>
                  <Crown className={`w-8 h-8 ${MEDAL_COLORS[0].icon} mx-auto mb-2`} />
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-2 flex items-center justify-center sm:w-16 sm:h-16 overflow-hidden p-1">
                    {renderAvatar(topThree[0], 72)}
                  </div>
                  <p className="text-white font-semibold">{topThree[0].userName}</p>
                  <p className="text-yellow-300 font-bold text-lg">{topThree[0].marks}%</p>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${MEDAL_COLORS[0].bg} ${MEDAL_COLORS[0].text} text-sm font-bold mt-2`}>
                    🥇
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className={`text-center ${currentUserEmail === topThree[2].userEmail ? "ring-2 ring-white/50 rounded-2xl p-3 bg-white/10" : ""}`}>
                  <div className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center sm:w-12 sm:h-12 overflow-hidden">
                    {renderAvatar(topThree[2], 64)}
                  </div>
                  <p className="text-white font-semibold text-sm">{topThree[2].userName}</p>
                  <p className="text-yellow-300 font-bold">{topThree[2].marks}%</p>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${MEDAL_COLORS[2].bg} ${MEDAL_COLORS[2].text} text-sm font-bold mt-2`}>
                    🥉
                  </div>
                </div>
              )}
            </div>

            {/* Remaining Players */}
            <div className="space-y-3">
              {remainingLeaders.map((leader, index) => {
                const isCurrentUser = currentUserEmail === leader.userEmail;
                return (
                  <div
                    key={leader.userEmail}
                    className={`flex items-center rounded-xl p-4 backdrop-blur-sm transition-colors ${
                      isCurrentUser
                        ? "bg-white/20 ring-1 ring-white/30"
                        : "bg-purple-500/50 hover:bg-purple-500/70"
                    }`}
                  >
                    <div className="w-8 text-white font-bold text-center">{index + 4}</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                      {renderAvatar(leader, 40)}
                    </div>
                    <div className="grow">
                      <p className="text-white font-semibold">
                        {leader.userName}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </p>
                      <p className="text-white/60 text-xs">{leader.count} quizzes taken</p>
                    </div>
                    <div className="text-yellow-300 font-bold">{leader.marks}%</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaders;
