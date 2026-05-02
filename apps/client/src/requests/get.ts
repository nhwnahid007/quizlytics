import axios from 'axios';
import type {
  AiQuizHistory,
  LinkQuizHistory,
  ManualQuiz,
  QuizHistory,
  QuizQuestion,
  UserExamAnswer,
} from "@quizlytics/types";

export type ManualQuizWithQuestions = Omit<ManualQuiz, "quizArr"> & {
  _id?: string;
  quizArr?: QuizQuestion[];
};

export type HistoryWithMongoId = QuizHistory & { _id?: string };
export type AiHistoryWithMongoId = AiQuizHistory & { _id?: string };
export type LinkHistoryWithMongoId = LinkQuizHistory & { _id?: string };

export const getMCQ = async (category: string, level: string): Promise<QuizQuestion[]> => {
    console.log(category, level);
    try {
        const res = await axios.get<QuizQuestion[]>(`https://quizlytics.jonomukti.org/quiz?category=${category}&skill=${level}`);
        return res.data;
    } catch (error) {   
        console.error("Error fetching MCQ:", error);
        return [];
    }

}
export const getQuizByLink = async (artLink: string): Promise<QuizQuestion[]> => {
    
    try {
        const res = await axios.get<QuizQuestion[]>(`https://quizlytics.jonomukti.org/testByLink?link=${artLink}`);
        return res.data;
    } catch (error) {   
        console.error("Error fetching MCQ:", error);
        return [];
    }
}

export const getMark = async(examId: string): Promise<UserExamAnswer[]> => {
    try {
        const res = await axios.get<UserExamAnswer[]>(`https://quizlytics-server-gamma.vercel.app/my_mark/${examId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching MCQ:", error);
        return [];
    }
}

export const getCustomQuiz = async(quizKey: string | null | undefined): Promise<ManualQuizWithQuestions[]> =>{
    try{
        const res = await axios.get<ManualQuizWithQuestions[]>(`https://quizlytics.jonomukti.org/getCustomQuizByKey?qKey=${quizKey ?? ""}`)
        return res.data;
    } catch(error){
        console.error("Error fetching Custom Quiz:", error);
    
        return [];
    }
}

export const allCustomQuiz = async(): Promise<ManualQuizWithQuestions[]> =>{
    try{
        const res = await axios.get<ManualQuizWithQuestions[]>(`https://quizlytics.jonomukti.org/allCustomQuiz`)
        return res.data;
    } catch(error){
        console.error("Error fetching All Custom Quiz:", error);
        return [];
    }
}

export const getSubmissionByKey = async (key: string, email: string): Promise<HistoryWithMongoId[]>=>{
    try{
        const res = await axios.get<HistoryWithMongoId[]>(`https://quizlytics.jonomukti.org/historyByKey?qKey=${key}&email=${email}`)
        return res.data;
    } catch(error){
        console.error("Error fetching submissions by key:", error)
        return [];
    }
}
export const getSubmissionByQuizTitle = async (searchCategory: string, email: string): Promise<AiHistoryWithMongoId[]>=>{
    try{
        const res = await axios.get<AiHistoryWithMongoId[]>(`https://quizlytics.jonomukti.org/historyByUserAi?qTitle=${searchCategory}&email=${email}`)
        return res.data;
    } catch(error){
        console.error("Error fetching submissions by key:", error)
        return [];
    }
}


export const getLinkHistoryByUser = async(email: string): Promise<LinkHistoryWithMongoId[]>=>{
    try{
        const res = await axios.get<LinkHistoryWithMongoId[]>(`https://quizlytics.jonomukti.org/linkHistoryByUser?email=${email}`)
        return res.data
    }
    catch(error){
        console.log("Error Fetching Data", error)
        return [];
    }
}

// export const getLeaders = async()=>{
//     try{
//         const res = await axios.get(`https://quizlytics.jonomukti.org/leaderboard`)
//         return res.data;
//     } catch(error){
//         console.log("Error fetching leaderboard:", error);
//         return [];
//     }
// }
export const getExaminees = async (): Promise<HistoryWithMongoId[]> => {
    try {
      const res = await axios.get<HistoryWithMongoId[]>("https://quizlytics.jonomukti.org/allExaminee");
      return res.data; 
    } catch (error) {
      console.error("Error fetching allExaminee:", error);
      return [];
    }
  };
export const getMarks = async(email: string): Promise<HistoryWithMongoId[]>=>{
    try{
        const res = await axios.get<HistoryWithMongoId[]>(`https://quizlytics.jonomukti.org/userHistory?email=${email}`)
        return res.data;
    } catch(error){
        console.log("Error fetching leaderboard:", error);
        return [];
    }
}
export const getSubmissionById = async(id: string): Promise<HistoryWithMongoId | null>=>{
    try{
        const res = await axios.get<HistoryWithMongoId>(`https://quizlytics.jonomukti.org/userHistory/${id}`)
        return res.data;
    } catch(error){
        console.log("Error fetching History:", error);
        return null;
    }
}

export default getMCQ;


