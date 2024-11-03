"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { getExaminees } from "@/requests/get";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { SectionTitleMinimal } from "./SectionTitle";

const Leaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const getAllExaminees = async () => {
      try {
        const data = await getExaminees();

        // Aggregate marks by userEmail and calculate average
        const examineeMap = data.reduce((acc, examinee) => {
          const { userEmail, marks } = examinee;
          if (!acc[userEmail]) {
            acc[userEmail] = { userEmail, marks: 0, count: 0, userName: examinee.userName, userImg: examinee.userImg };
          }
          acc[userEmail].marks += marks;
          acc[userEmail].count += 1;
          return acc;
        }, {});

        // Calculate average and get the top 5
        const averagedLeaders = Object.values(examineeMap)
          .map(examinee => ({
            ...examinee,
            marks: (examinee.marks / examinee.count).toFixed(2),
          }))
          .sort((a, b) => b.marks - a.marks)
          .slice(0, 5);

        setLeaders(averagedLeaders);
      } catch (error) {
        console.log("Data fetching error", error);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  const topThree = leaders.slice(0, 3); // Top 3 players
  const remainingLeaders = leaders.slice(3); // Remaining players (4th and 5th)

  return (
    <div className="p-8 rounded-lg max-w-3xl mx-auto">
      <SectionTitleMinimal heading="LEADERBOARD" subHeading="Recognizing Excellence" />
      
      <div className="bg-purple-600 p-8 rounded-lg">
        <div className="text-white text-xl mb-6">
          {currentMonth} {currentYear}
        </div>

        {/* Top 3 Players */}
        <div className="flex bg-purple-600 justify-center items-end gap-8 mb-12">
          {topThree[1] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                <Image
                  src={topThree[1].userImg || "https://i.ibb.co.com/6R6bSSV/user.png"}
                  alt="Player"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <p className="text-white font-semibold">{topThree[1].userName}</p>
              <p className="text-yellow-300">{topThree[1].marks}%</p>
              <div className="text-2xl text-white mt-2">2</div>
            </div>
          )}

          {topThree[0] && (
            <div className="text-center -mt-8">
              <Crown className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                <Image
                  src={topThree[0].userImg || "https://i.ibb.co.com/6R6bSSV/user.png"}
                  alt="Player"
                  width={72}
                  height={72}
                  className="rounded-full"
                />
              </div>
              <p className="text-white font-semibold">{topThree[0].userName}</p>
              <p className="text-yellow-300">{topThree[0].marks}%</p>
              <div className="text-2xl text-white mt-2">1</div>
            </div>
          )}

          {topThree[2] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                <Image
                  src={topThree[2].userImg || "https://i.ibb.co.com/6R6bSSV/user.png"}
                  alt="Player"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <p className="text-white font-semibold">{topThree[2].userName}</p>
              <p className="text-yellow-300">{topThree[2].marks}%</p>
              <div className="text-2xl text-white mt-2">3</div>
            </div>
          )}
        </div>

        {/* Leaderboard List for 4th and 5th Players */}
        <div className="space-y-4 bg-purple-600">
          {remainingLeaders.map((leader, index) => (
            <div
              key={leader.userEmail}
              className="flex items-center bg-purple-500/50 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="w-8 text-white font-bold">{index + 4}</div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <Image
                  src={leader.userImg || "https://i.ibb.co.com/6R6bSSV/user.png"}
                  alt="Player"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-grow">
                <p className="text-white font-semibold">{leader.userName}</p>
              </div>
              <div className="text-yellow-300 font-bold">{leader.marks}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaders;
