import axios from 'axios';

export const postNewUser = async (newUser) => {
  try {
    const response = await axios.post('https://quizlytics.jonomukti.org/registered_users', newUser);
    return response;
  } catch (error) {
    console.error("Error posting new user:", error);
    throw error; 
  }
}

export const postUserWithProvider = async (newUser) => {
  try {
    const response = await axios.post('https://quizlytics.jonomukti.org/authenticating_with_providers', newUser);
    return response;
  } catch (error) {
    console.error("Error posting user with provider:", error);
    throw error; // 
  }
}

export const postUserExamData = async (userExamData) => {
  try {
    const response = await axios.post("https://quizlytics-server-gamma.vercel.app/user_exam_data", userExamData);
    return response;
  } catch (error) {
    console.error("Error posting user exam data:", error);
    throw error; // Rethrow the error after logging it
  }
}

export const postOnlyMark = async (userMark) => {
  try {
    const response = await axios.post("https://quizlytics-server-gamma.vercel.app/only_user_mark", userMark);
    return response;
  } catch (error) {
    console.error("Error posting only mark:", error);
    throw error; // Rethrow the error after logging it
  }
}
