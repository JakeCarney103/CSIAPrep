// Book selection options derived from masterKey
const bookSelectionOptions = masterKey.map(book => ({ bookName: book.bookName }));

// DOM ready helper
function onDomReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

onDomReady(() => {
  if (sessionStorage.getItem('auth') !== 'true') {
    showPasswordGate();
    return;
  }

  replaceState({ stage: 'book-selection' });
  loadBookSelectionOptions();
  validateQuizAnswers();
});

function showPasswordGate() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="password-container">
      <h1>Tool Access</h1>

      <div class="block password-block">
        <p class="instruction">
          Enter the access password to continue.
        </p>

        <input
          type="password"
          id="pw"
          class="password-input"
          placeholder="Password"
          autocomplete="current-password"
        />

        <button id="loginBtn">Enter</button>

        <p class="password-error" style="display:none;"></p>
      </div>
    </div>
  `;

  // Shake animation helper
  function shakePasswordBlock() {
    const block = document.querySelector('.password-block');
    if (!block) return;
    block.classList.remove('shake');
    void block.offsetWidth; // force reflow
    block.classList.add('shake');
  }

  // Show inline error
  function showPasswordError(msg) {
    const errorEl = document.querySelector('.password-error');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  // Clear error when typing
  document.getElementById('pw').addEventListener('input', () => {
    const errorEl = document.querySelector('.password-error');
    errorEl.style.display = 'none';
  });

  // Login button
  document.getElementById('loginBtn').onclick = async (e) => {
	e.preventDefault();
    const pw = document.getElementById('pw').value;
    const ok = await verifyPassword(pw);

    if (ok) {
      // Correct password: save auth and reload
      sessionStorage.setItem('auth', 'true');
      location.reload();
    } else {
      // Wrong password: shake and show error
      shakePasswordBlock();
      showPasswordError('Incorrect password. Try again!');
    }
  };
}

function shakePasswordBlock() {
  const block = document.querySelector('.password-block');
  if (!block) return;
  block.classList.remove('shake');
  void block.offsetWidth;
  block.classList.add('shake');
}

async function verifyPassword(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hash = [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return hash === '5c0d52abd9a9ecbe7bf08a7b55ce689a210ca31e8a1d652cf719ff23e4518cac';
}


// Popstate handler
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
      const selectedQuizInfo = quizSelectorDictionary.find(q => q.quizName === selected.value);
      const questionsAreDefined = window.quizRegistry[selectedQuizInfo.quizName];
      if (selectedQuizInfo && questionsAreDefined) {
        pushState({ stage: 'quiz', bookName: selectedBookInfo.bookName, quizName: selectedQuizInfo.quizName });
        clearMainForm();
        loadQuiz(selectedQuizInfo, selectedBookInfo);
      } else {
        alert("Questions are not yet defined for the selected quiz!");
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

// Load and render quiz
function loadQuiz(selectedQuizInfo, selectedBookInfo) {
  window.scrollTo(0, 0); 
  const quizData = window.quizRegistry[selectedQuizInfo.quizName];
  const main = document.getElementById('main');
  const quizTitle = document.createElement('h2');
  quizTitle.innerText = selectedQuizInfo.quizName;
  main.appendChild(quizTitle);

  const shuffledQuizData = shuffleArray([...quizData]);
  shuffledQuizData.forEach((q, index) => {
    const div = document.createElement('div');
    div.classList.add('block');
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

// --- Quiz handling functions remain unchanged ---
function submitQuiz(selectedQuizInfo, overallQuizData) {
  let score = 0;
  let unanswered = 0;
  overallQuizData.forEach((q, index) => {
    const selected = document.querySelector(`input[name='q${index + 1}']:checked`);
    if (!selected) {
      unanswered++;
    } else {
      const optionElement = selected.parentElement;
      const questionElement = optionElement.parentElement.querySelector('.question');
      if (selected.value === q.answer) {
        score++;
        updateQuestionResult(optionElement, questionElement, true);
      } else {
        updateQuestionResult(optionElement, questionElement, false);
      }
    }
  });

  displayScore(score, overallQuizData.length, unanswered);
}

function updateQuestionResult(optionElement, questionElement, isCorrect) {
  addStatusIcon(optionElement, isCorrect);
  const blockDiv = questionElement.closest('.block');
  if (blockDiv) {
    blockDiv.classList.remove('correct', 'incorrect');
    blockDiv.classList.add(isCorrect ? 'correct' : 'incorrect');
  }
}

function displayScore(score, total, unanswered) {
  const main = document.getElementById('main');
  const existingScore = document.querySelector('.score');
  if (existingScore) existingScore.remove();

  const scoreElement = document.createElement('p');
  scoreElement.classList.add('score');
  if (unanswered > 0) scoreElement.classList.add('warning');

  const resultPercent = (score / total) * 100;
  scoreElement.innerText = unanswered === 0
    ? `You scored ${score} out of ${total} (${resultPercent.toFixed(2)}%) ✅`
    : `You scored ${score} out of ${total} (${resultPercent.toFixed(2)}%) ⚠️ You have ${unanswered} unanswered question(s)!`;

  main.appendChild(scoreElement);
}

function addStatusIcon(parentElement, isSuccess) {
  if (!parentElement) return;

  parentElement.parentElement.querySelectorAll('.status-icon').forEach(el => el.remove());

  const icon = document.createElement('span');
  icon.classList.add('status-icon');
  icon.style.marginLeft = '8px';
  icon.style.fontWeight = 'bold';
  icon.style.color = isSuccess ? 'green' : 'red';
  icon.textContent = isSuccess ? '✔' : '✖';
  parentElement.appendChild(icon);
}

// Shuffle helper
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Clear main form
function clearMainForm() {
  document.getElementById('main').innerHTML = '';
}

// History helpers
function pushState(state) {
  history.pushState(state, '', '');
}

function replaceState(state) {
  history.replaceState(state, '', '');
}

function isLocalHost() {
  const protocol = window.location.protocol;
  return protocol === 'file:' || (protocol === 'http:' && window.location.hostname === 'localhost');
}
