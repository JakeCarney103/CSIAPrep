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
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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