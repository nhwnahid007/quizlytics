export {
  allCustomQuiz,
  getCustomQuiz,
  getExaminees,
  getLinkHistoryByUser,
  getMark,
  getMarks,
  getMCQ,
  getQuizByLink,
  getSubmissionById,
  getSubmissionByKey,
  getSubmissionByQuizTitle,
} from "@/services/quiz.service";
export type {
  AiHistoryWithMongoId,
  HistoryWithMongoId,
  LinkHistoryWithMongoId,
  ManualQuizWithQuestions,
} from "@/services/quiz.service";
export { getMCQ as default } from "@/services/quiz.service";
