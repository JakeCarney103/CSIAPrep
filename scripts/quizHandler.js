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
  // remove any previous score display (old .score paragraph or .block.score container)
  const prevScoreBlock = document.querySelector('.score');
  if (prevScoreBlock) prevScoreBlock.remove();

  // Create a block container so the score and counts appear in the same styled block
  const scoreBlock = document.createElement('div');
  scoreBlock.classList.add('score');

  const resultPercent = (score / total) * 100;
  const scoreText = document.createElement('p');
  scoreText.classList.add('score-text');
  let iconResultBeginning = unanswered > 0 ? '⚠️' : (resultPercent >= 80 ? '✅' : '❌');
  let iconResultEnd = unanswered > 0 ? '⚠️' : (resultPercent >= 80 ? '✅' : '❌');
  let classResult = unanswered > 0 ? 'warning' : (resultPercent >= 80 ? 'pass' : 'failed');
  if (resultPercent === 100) {
    iconResultBeginning = '🏆🎉🍻';
    iconResultEnd = '🍻🎉🏆';
  }
  scoreBlock.classList.add(classResult);
  
  scoreText.innerText = unanswered === 0
    ? ` ${iconResultBeginning} You scored ${score} out of ${total} (${resultPercent.toFixed(2)}%) ${iconResultEnd} `
    : ` ${iconResultBeginning} You scored ${score} out of ${total} (${resultPercent.toFixed(2)}%) | You have ${unanswered} unanswered question(s)! ${iconResultEnd} `;

  scoreBlock.appendChild(scoreText);

  // Counts: Correct / Incorrect / Unanswered stacked and centered
  const countsContainer = document.createElement('div');
  countsContainer.className = 'score-counts';

  const correctCount = document.createElement('div');
  correctCount.className = 'score-count';
  correctCount.innerText = `Correct ✅: ${score}`;

  const incorrectCount = document.createElement('div');
  incorrectCount.className = 'score-count';
  incorrectCount.innerText = `Incorrect ❌: ${Math.max(0, total - score - unanswered)}`;

  const unansweredCount = document.createElement('div');
  unansweredCount.className = 'score-count';
  unansweredCount.innerText = `Unanswered ⚠️: ${unanswered}`;

  countsContainer.appendChild(correctCount);
  countsContainer.appendChild(incorrectCount);
  countsContainer.appendChild(unansweredCount);

  scoreBlock.appendChild(countsContainer);

  main.appendChild(scoreBlock);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  // Launch confetti when user scores perfectly
  if (resultPercent === 100) {
    launchConfetti();
  }
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

// Simple confetti launcher: creates a bunch of colored divs and lets CSS animate them
function launchConfetti() {
  try {
    const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
    const container = document.createElement('div');
    container.className = 'confetti-container';
    const count = 150;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.background = color;
      el.style.left = Math.random() * 100 + '%';
      el.style.opacity = (0.6 + Math.random() * 0.4).toString();
      el.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
      // longer, varied delays and durations so confetti lingers
      el.style.animationDelay = (Math.random() * 1.2) + 's';
      el.style.animationDuration = (4 + Math.random() * 3) + 's';
      container.appendChild(el);
    }
    document.body.appendChild(container);
    // remove after animations finish (give a bit of buffer)
    setTimeout(() => { container.remove(); }, 7000);
  } catch (e) {
    // fail silently
    console.error('Confetti error', e);
  }
}