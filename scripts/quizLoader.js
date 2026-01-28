// ===== Quiz Loader & Display Functions =====
// Book selection options derived from masterKey
const bookSelectionOptions = masterKey.map(book => ({ bookName: book.bookName }));

// Load book selection
function loadBookSelectionOptions() {
  window.scrollTo(0, 0); 
  const main = document.getElementById('main');
  const div = document.createElement('div');
  div.classList.add('block');
  const quizSelectionQuestion = document.createElement('p');
  quizSelectionQuestion.classList.add('instruction');
  quizSelectionQuestion.innerHTML = 'Select the book you would like to take quizzes against!';
  div.appendChild(quizSelectionQuestion);

  bookSelectionOptions.forEach(book => {
    const label = document.createElement('label');
    label.classList.add('options');
    label.innerHTML = `<input type='radio' name='bookSelection' value='${book.bookName}'> ${book.bookName}`;
    div.appendChild(label);
    div.appendChild(document.createElement('br'));
  });
  main.appendChild(div);
  
  // Wrap the button in a center-buttons container
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('center-buttons');

  const viewQuizOptionsButton = document.createElement('button');
  viewQuizOptionsButton.textContent = 'View Quiz Options!';
  viewQuizOptionsButton.type = 'button';
  viewQuizOptionsButton.onclick = function () {
    const selected = document.querySelector('input[name="bookSelection"]:checked');
    if (selected) {
      const selectedBookInfo = masterKey.find(book => book.bookName === selected.value);
      if (selectedBookInfo) {
        pushState({ stage: 'quiz-selection', bookName: selectedBookInfo.bookName });
        clearMainForm();
        loadQuizSelectionOptions(selectedBookInfo);
      } else {
        alert("This book isn't defined, please select another!");
      }
    } else {
      alert("Please select a Book!");
    }
  };
  
  buttonWrapper.appendChild(viewQuizOptionsButton);
  main.appendChild(buttonWrapper);
}
// Load quiz selection for a book
function loadQuizSelectionOptions(selectedBookInfo) {
  window.scrollTo(0, 0); 
  const quizSelectorDictionary = selectedBookInfo.quizDictionary;
  const main = document.getElementById('main');
  const div = document.createElement('div');
  div.classList.add('block');
  const quizSelectionQuestion = document.createElement('p');
  quizSelectionQuestion.classList.add('instruction');
  quizSelectionQuestion.innerHTML = 'Select the quiz you would like to take!';
  div.appendChild(quizSelectionQuestion);

  quizSelectorDictionary.forEach(quiz => {
    const label = document.createElement('label');
    label.classList.add('options');
    label.innerHTML = `<input type='radio' name='quizSelection' value='${quiz.quizName}'> ${quiz.quizName}`;
    div.appendChild(label);
    div.appendChild(document.createElement('br'));
  });

  // Add custom quiz option if any questions are selected
  const customQuizCount = getCustomQuestionIds(selectedBookInfo.bookName).length;
  if (customQuizCount > 0) {
    div.appendChild(document.createElement('br'));
    const customLabel = document.createElement('label');
    customLabel.classList.add('options');
    customLabel.style.fontWeight = 'bold';
    customLabel.style.color = '#155a8a';
    customLabel.innerHTML = `<input type='radio' name='quizSelection' value='__CUSTOM_QUIZ__'> My Custom Quiz (${customQuizCount} questions)`;
    div.appendChild(customLabel);
  }

  main.appendChild(div);
  
  // Wrap the button in a center-buttons container
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('center-buttons');
  buttonWrapper.classList.add('vertical');

  const beginQuizButton = document.createElement('button');
  beginQuizButton.textContent = 'Begin Quiz!';
  beginQuizButton.type = 'button';
  beginQuizButton.onclick = function () {
    const selected = document.querySelector('input[name="quizSelection"]:checked');
    if (selected) {
      const selectedValue = selected.value;
      
      // Handle custom quiz
      if (selectedValue === '__CUSTOM_QUIZ__') {
        const customQuestions = buildCustomQuiz(selectedBookInfo.bookName, quizSelectorDictionary);
        if (customQuestions.length > 0) {
          pushState({ stage: 'quiz', bookName: selectedBookInfo.bookName, quizName: '__CUSTOM_QUIZ__' });
          clearMainForm();
          loadQuiz(customQuestions, selectedBookInfo, true);
        } else {
          alert("No custom questions selected!");
        }
      } else {
        // Handle regular quiz
        const selectedQuizInfo = quizSelectorDictionary.find(q => q.quizName === selectedValue);
        const questionsAreDefined = window.quizRegistry[selectedQuizInfo.quizName];
        if (selectedQuizInfo && questionsAreDefined) {
          pushState({ stage: 'quiz', bookName: selectedBookInfo.bookName, quizName: selectedQuizInfo.quizName });
          clearMainForm();
          loadQuiz(selectedQuizInfo, selectedBookInfo);
        } else {
          alert("Questions are not yet defined for the selected quiz!");
        }
      }
    } else {
      alert("Please select a Quiz!");
    }
  };
  buttonWrapper.appendChild(beginQuizButton);

  const backToBookSelectionButton = document.createElement('button');
  backToBookSelectionButton.textContent = 'Back to Book Selection';
  backToBookSelectionButton.type = 'button';
  backToBookSelectionButton.classList.add('back-button');
  backToBookSelectionButton.onclick = function () { 
	window.scrollTo(0, 0); 
    history.back();
  };
  buttonWrapper.appendChild(backToBookSelectionButton);
  
  main.appendChild(buttonWrapper);
}

// Load and render quiz (handles both regular and custom quizzes)
function loadQuiz(selectedQuizInfo, selectedBookInfo, isCustomQuiz = false) {
  window.scrollTo(0, 0); 
  const quizData = isCustomQuiz ? selectedQuizInfo : window.quizRegistry[selectedQuizInfo.quizName];
  
  if (!quizData) {
    alert('Quiz data not found!');
    return;
  }
  
  const main = document.getElementById('main');
  const quizTitle = document.createElement('h2');
  quizTitle.innerText = isCustomQuiz ? `My Custom Quiz (${quizData.length} questions)` : selectedQuizInfo.quizName;
  main.appendChild(quizTitle);

  const shuffledQuizData = shuffleArray([...quizData]);
  shuffledQuizData.forEach((q, index) => {
    const div = document.createElement('div');
    div.classList.add('block');
    
    // Add checkbox for custom quiz selection
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'question-checkbox-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'question-checkbox';
    checkbox.dataset.questionId = q.id;
    checkbox.dataset.bookName = selectedBookInfo.bookName;
    
    // Check if this question is already in custom quiz (only for non-custom quizzes)
    if (!isCustomQuiz) {
      const currentCustomIds = getCustomQuestionIds(selectedBookInfo.bookName);
      checkbox.checked = currentCustomIds.includes(q.id);
    } else {
      checkbox.checked = true;
    }
    
    checkbox.onchange = function () {
      toggleCustomQuestion(selectedBookInfo.bookName, q.id);
    };
    
    checkboxContainer.appendChild(checkbox);
    
    const checkboxLabel = document.createElement('span');
    checkboxLabel.className = 'checkbox-label';
    checkboxLabel.textContent = isCustomQuiz ? 'Remove from Custom Quiz' : 'Add to Custom Quiz';
    checkboxContainer.appendChild(checkboxLabel);
    
    div.appendChild(checkboxContainer);
    
    const question = document.createElement('h3');
    question.innerHTML = `${index + 1}. ${q.question}`;
    question.classList.add('question');
    div.appendChild(question);

    const shuffledOptions = shuffleArray([...q.options]);
    shuffledOptions.forEach(option => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${index + 1}`;
      input.value = option;
      label.append(input, ` ${option}`);
      div.appendChild(label);
      div.appendChild(document.createElement('br'));
    });

    main.appendChild(div);
  });
  
  // Wrap the button in a center-buttons container
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('center-buttons');
  buttonWrapper.classList.add('vertical');

  const submitQuizButton = document.createElement('button');
  submitQuizButton.textContent = 'Check Results!';
  submitQuizButton.type = 'button';
  submitQuizButton.onclick = function () {
    submitQuiz(selectedQuizInfo, shuffledQuizData);
  };
  buttonWrapper.appendChild(submitQuizButton);

  const backToQuizSelectionButton = document.createElement('button');
  backToQuizSelectionButton.textContent = 'Back to Quiz Selection';
  backToQuizSelectionButton.type = 'button';
  backToQuizSelectionButton.classList.add('back-button');
  backToQuizSelectionButton.onclick = function () {
	window.scrollTo(0, 0);
    history.back(); 
  };
  buttonWrapper.appendChild(backToQuizSelectionButton);
  main.appendChild(buttonWrapper);
}
