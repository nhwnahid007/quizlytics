
export const postNewUser = async (newUser) => {
  const response = await fetch('https://quizlytics-server-gamma.vercel.app/registered_users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  });
  return response;
}

export const postUserWithProvider = async (newUser) => {
  const response = await fetch('https://quizlytics-server-gamma.vercel.app/authenticating_with_providers', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
  })
  return response;
}

export const postUserExamData = async (userExamData) => {
  const response = await fetch("https://quizlytics-server-gamma.vercel.app/user_exam_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userExamData)
  })
  return response;
}

export const postOnlyMark = async (userMark) => {
  const response = await fetch("https://quizlytics-server-gamma.vercel.app/only_user_mark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userMark)
  })
  return response;
}
