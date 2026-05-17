"use client";
import useMakeExam from "@/app/hooks/useMakeExam";
import MakeExam from "@/components/Modals/MakeExam";
import "./style.css";
import Questions from "@/components/Questions/Questions";
import useQuestionNumber from "@/app/hooks/useQuestionNumber";
import useDate from "@/app/hooks/useDate";
import useUserExamData from "@/app/hooks/useUserExamData";
import { useEffect, useState } from "react";
import { postOnlyMark, postUserExamData } from "@/requests/post";
import Swal from "sweetalert2";
import useShowResult from "@/app/hooks/useShowResult";
import { useSession } from "next-auth/react";
import useExamId from "@/app/hooks/useExamId";
import useAllMCQ from "@/app/hooks/useAllMCQ";
import { getMCQ } from "@/requests/get";
import ExamResult from "@/components/Modals/ExamResult";
import useSearchCategory from "@/app/hooks/useSearchCategory";
import useSearchLevel from "@/app/hooks/useSearchLevel";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";

const Exam = () => {
  const [showMakeExam, setShowMakeExam] = useMakeExam();
  const [currentMCQ, setCurrentMCQ] = useQuestionNumber();
  const today = useDate();
  const [userExamData, setUserExamData] = useUserExamData();
  const [showResult, setShowResult] = useShowResult();
  const [allMCQ, setAllMCQ] = useAllMCQ();
  const [examId, setExamId] = useExamId();
  const [searchCategory, setSearchCategory] = useSearchCategory();
  const [searchLavel, setSearchLavel] = useSearchLevel();
  const [isDataSent, setIsDataSent] = useState<boolean>(false);
  const [myMark, setMyMark] = useState<number | null>(null);
  const [loadData, setLoadData] = useState<boolean>(false);

  const { data: session } = useSession();
  const name = session?.user?.name;
  const email = session?.user?.email;
  const profile = session?.user?.profile;
  const image = session?.user?.image;

  useEffect(() => {
    const getAllMCQ = async () => {
      try {
        const data = await getMCQ(searchCategory, searchLavel);
        setAllMCQ(data);
      } catch {
        setAllMCQ([]);
      }
    };

    if (loadData) {
      getAllMCQ();
    }
  }, [loadData, searchCategory, searchLavel, setAllMCQ]);

  useEffect(() => {
    const updatingMark = () => {
      try {
        const correctMCQ = userExamData.filter(
          data => data.user_answer === data.options[Number(data.correct_answer)]
        );
        const calculatedMark = correctMCQ.length;
        setMyMark(calculatedMark);
      } catch {
        setMyMark(0);
      }
    };
    if (showResult) {
      updatingMark();
    }
  }, [showResult, userExamData]);

  useEffect(() => {
    const sendingExamData = async () => {
      if (!isDataSent && showResult) {
        try {
          const response = await postUserExamData(userExamData);
          if (response && response.status === 200) {
            const correctMCQ = userExamData.filter(
              data =>
                data.user_answer === data.options[Number(data.correct_answer)]
            );
            const calculatedMark = correctMCQ.length;

            const userResultMark = {
              examId: examId,
              exam_date: today,
              name,
              email,
              profile: image || profile,
              my_mark: calculatedMark,
            };
            const resultResponse = await postOnlyMark(userResultMark);

            if (resultResponse && resultResponse.status === 200) {
              Swal.fire("Exam result saved successfully!", "", "success");
            }

            setIsDataSent(true);
          }
        } catch {
          Swal.fire("Error sending data", "Please try again.", "error");
        }
      }
    };

    if (showResult && !isDataSent) {
      sendingExamData();
    }
  }, [
    userExamData,
    name,
    email,
    image,
    profile,
    examId,
    today,
    isDataSent,
    showResult,
  ]);

  return (
    <div className="bg-[#dad7cd] min-h-[100vh] py-20">
      {showMakeExam ? (
        <MakeExam
          setShowMakeExam={setShowMakeExam}
          setSearchLavel={setSearchLavel}
          setSearchCategory={setSearchCategory}
          setLoadData={setLoadData}
        />
      ) : (
        <>
          {allMCQ.length !== 10 ? (
            <LoadingSpinner />
          ) : !showResult ? (
            <>
              <div className="mx-auto mb-3 w-full max-w-2xl rounded-2xl bg-black p-4 text-[#ffefd3]">
                <h2 className="text-2xl text-center font-bold text-[#39FF14]">
                  Assessment Overview
                </h2>
                <div className="mx-auto my-6 flex w-full max-w-xl flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex flex-col space-y-1">
                    <h1>
                      <span className="font-semibold text-[#f08f45]">
                        Date:
                      </span>{" "}
                      {today}
                    </h1>
                    <h1>
                      <span className="font-semibold text-[#f08f45]">
                        Duration:
                      </span>{" "}
                      100 Seconds
                    </h1>
                    <h1>
                      <span className="font-semibold text-[#f08f45]">
                        Examinee:
                      </span>{" "}
                      {name ? name : "Guest"}
                    </h1>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h1>
                      <span className="font-semibold text-[#f08f45]">MCQ:</span>{" "}
                      10
                    </h1>
                    <h1>
                      <span className="font-semibold text-[#f08f45]">
                        Total Marks:
                      </span>{" "}
                      1 x 10 = 10
                    </h1>
                  </div>
                </div>
              </div>

              <Questions
                currentMCQ={currentMCQ}
                setCurrentMCQ={setCurrentMCQ}
                userExamData={userExamData}
                setUserExamData={setUserExamData}
                examId={examId}
                setExamId={setExamId}
                allMCQ={allMCQ}
                setAllMCQ={setAllMCQ}
                setShowResult={setShowResult}
              />
            </>
          ) : (
            <ExamResult myMark={myMark} />
          )}
        </>
      )}
    </div>
  );
};

export default Exam;
