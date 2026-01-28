// ===== Custom Quiz Functions =====

function getCustomQuizKey(bookName) {
  return `customQuiz_${bookName}`;
}

function getCustomQuestionIds(bookName) {
  const key = getCustomQuizKey(bookName);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

function saveCustomQuestionIds(bookName, ids) {
  const key = getCustomQuizKey(bookName);
  if (ids.length === 0) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(ids));
  }
}

function toggleCustomQuestion(bookName, questionId) {
  const ids = getCustomQuestionIds(bookName);
  const index = ids.indexOf(questionId);
  
  if (index > -1) {
    // Remove if exists
    ids.splice(index, 1);
  } else {
    // Add if doesn't exist
    ids.push(questionId);
  }
  
  saveCustomQuestionIds(bookName, ids);
}

function buildCustomQuiz(bookName, allQuizzes) {
  const customIds = getCustomQuestionIds(bookName);
  const customQuestions = [];
  
  // Search through all quizzes for questions matching the IDs
  allQuizzes.forEach(quizInfo => {
    const quizData = window.quizRegistry[quizInfo.quizName];
    if (quizData) {
      quizData.forEach(question => {
        if (customIds.includes(question.id)) {
          customQuestions.push(question);
        }
      });
    }
  });
  
  return customQuestions;
}
