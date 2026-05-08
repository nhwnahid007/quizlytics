export { postNewUser, postProviderUser as postUserWithProvider } from "@/services/auth.service";
import type { ApiMessageResponse, UserExamAnswer } from "@quizlytics/types";

type LegacyResponse = {
  status: number;
  data: ApiMessageResponse;
};

type LegacyMarkPayload = {
  id?: string;
  examId?: string;
  exam_date?: string;
  my_mark?: number;
  name?: string | null;
  email?: string | null;
  profile?: string | null;
};

export const postUserExamData = async (
  _userExamData: UserExamAnswer[],
): Promise<LegacyResponse> => ({
  status: 200,
  data: { message: "Legacy exam data endpoint is not configured" },
});

export const postOnlyMark = async (
  _userMark: LegacyMarkPayload,
): Promise<LegacyResponse> => ({
  status: 200,
  data: { message: "Legacy mark endpoint is not configured" },
});
