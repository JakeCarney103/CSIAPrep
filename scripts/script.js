// ===== Main Application Initialization =====
onDomReady(() => {
  if (sessionStorage.getItem('auth') !== 'true') {
    showPasswordGate();
    return;
  }

  replaceState({ stage: 'book-selection' });
  loadBookSelectionOptions();
  validateQuizAnswers();
});

// Popstate handler for browser navigation
window.addEventListener('popstate', function (event) {
  if (!event.state) return;

  clearMainForm();

  switch (event.state.stage) {
    case 'book-selection':
      loadBookSelectionOptions();
      break;

    case 'quiz-selection':
      loadQuizSelectionOptions(masterKey.find(b => b.bookName === event.state.bookName));
      break;

    case 'quiz':
      const bookInfo = masterKey.find(b => b.bookName === event.state.bookName);
      const quizInfo = bookInfo.quizDictionary.find(q => q.quizName === event.state.quizName);
      loadQuiz(quizInfo, { bookName: bookInfo.bookName });
      break;
  }
});
