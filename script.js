const quizSelectorDictionary = [
  {
    quizName: "NFPA 211 - Chapter 1: Administration",
    fileName: "nfpa211-chapter1.js",
  },
  {
    quizName: "NFPA 211 - Chapter 2: Referenced Publications",
    fileName: "nfpa211-chapter2.js",
  },
  {
    quizName: "NFPA 211 - Chapter 3: Definitions",
    fileName: "nfpa211-chapter3.js",
  },
  {
    quizName: "NFPA 211 - Chapter 4: General Requirements",
    fileName: "nfpa211-chapter4.js",
  },
  {
    quizName: "NFPA 211 - Chapter 5: Selection of Chimney and Vent Types",
    fileName: "nfpa211-chapter5.js",
  },
  {
    quizName: "NFPA 211 - Chapter 6: Factory-Built Chimneys and Chimney Units",
    fileName: "nfpa211-chapter6.js",
  },
  {
    quizName: "NFPA 211 - Chapter 7: Masonry Chimneys",
    fileName: "nfpa211-chapter7.js",
  },
  {
    quizName: "NFPA 211 - Chapter 8: Unlisted Metal Chimneys (Smokestacks) for Nonresidential Applications",
    fileName: "nfpa211-chapter8.js",
  },
  {
    quizName: "NFPA 211 - Chapter 9: Chimney Connectors and Vent Connectors",
    fileName: "nfpa211-chapter9.js",
  },
  {
    quizName: "NFPA 211 - Chapter 10: Vents",
    fileName: "nfpa211-chapter10.js",
  },
  {
    quizName: "NFPA 211 - Chapter 11: Fireplaces",
    fileName: "nfpa211-chapter11.js",
  },
  {
    quizName: "NFPA 211 - Chapter 12: Masonry Heaters",
    fileName: "nfpa211-chapter12.js",
  },
  {
    quizName: "NFPA 211 - Chapter 13: Solid Fuel-Burning Appliances",
    fileName: "nfpa211-chapter13.js",
  },
  {
    quizName: "NFPA 211 - Chapter 14: Maintenance",
    fileName: "nfpa211-chapter14.js",
  },
  {
    quizName: "NFPA 211 - Chapter 15: Inspection of Existing Chimneys",
    fileName: "nfpa211-chapter15.js",
  }
];

document.addEventListener('DOMContentLoaded', function() {
  loadQuizSelectionOptions();
});

function loadQuizSelectionOptions(){
	const main = document.getElementById('main');
	const div = document.createElement('div');
		div.classList.add('quizBlock');
		const quizSelectionQuestion = document.createElement('p');
		quizSelectionQuestion.classList.add('quizSelectionQuestion');
		quizSelectionQuestion.innerHTML = 'Select the quiz you would like to take!';
		div.appendChild(quizSelectionQuestion);
	quizSelectorDictionary.forEach(quiz =>{
		const label = document.createElement('label');
		label.classList.add('quizOptions');
		label.innerHTML = `<input type='radio' name='quizSelection' value='${quiz.quizName}'> ${quiz.quizName}`;
		div.appendChild(label);
		div.appendChild(document.createElement('br'));
	});
	main.appendChild(div);
	const beginQuizButton = document.createElement('button')
	beginQuizButton.textContent = 'Begin Quiz!'
	beginQuizButton.type = 'button';
	beginQuizButton.onclick = function() {
		const selected = document.querySelector('input[name="quizSelection"]:checked');
		if (selected)
		{
			const selectedQuizInfo = quizSelectorDictionary.find(quiz => quiz.quizName === selected.value);
			const questionsAreDefined = window.quizRegistry[selectedQuizInfo.quizName];
			if (selectedQuizInfo && questionsAreDefined){
				clearMainForm();
				loadQuiz(selectedQuizInfo);
			}else{
				alert ("Questions are not yet defined for the selected quiz!")
			}
		}
		else
		{
			alert("Please select a Quiz!");
		}
	}
	main.appendChild(beginQuizButton);
}

function clearMainForm(){
	const mainForm = document.getElementById('main');
	mainForm.innerHTML = '';
}

function loadQuiz(selectedQuizInfo){
	const quizData = window.quizRegistry[selectedQuizInfo.quizName];
	const main = document.getElementById('main');
	const quizTitle = document.createElement('h2');
	quizTitle.innerText = selectedQuizInfo.quizName;
	main.appendChild(quizTitle);
    quizData.forEach((q, index) => {
      const div = document.createElement('div');
      div.classList.add('questionBlock');
	  const question = document.createElement('h3');
	  question.innerHTML = `${index + 1}. ${q.question}`;
	  question.classList.add('question');
	  div.appendChild(question);
      q.options.forEach(option => {
        const label = document.createElement('label');
        label.innerHTML = `<input type='radio' name='q${index}' value='${option}'> ${option}`;
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
      });
      main.appendChild(div);
    });
	const submitQuizButton = document.createElement('button')
	submitQuizButton.textContent = 'Check Results!'
	submitQuizButton.type = 'button';
	submitQuizButton.onclick = function() {
		submitQuiz(selectedQuizInfo);
	}
	main.appendChild(submitQuizButton);
	
	const backToQuizSelectionButton = document.createElement('button')
	backToQuizSelectionButton.textContent = 'Back to Quiz Selection'
	backToQuizSelectionButton.type = 'button';
	backToQuizSelectionButton.onclick = function() {
		clearMainForm();
		loadQuizSelectionOptions();
	}
	main.appendChild(backToQuizSelectionButton);

}


function submitQuiz(selectedQuizInfo) {
      let score = 0;
	  const quizData = window.quizRegistry[selectedQuizInfo.quizName];
      quizData.forEach((q, index) => {
        const selected = document.querySelector(`input[name='q${index}']:checked`);
		let optionElement = selected.parentElement;
		let questionElement = optionElement.parentElement.querySelector('.question');
        if(selected && selected.value === q.answer) { 
			score++;
			updateQuestionResult(optionElement, questionElement, true);
		}else{
			updateQuestionResult(optionElement, questionElement, false);
		}
      });
	  
	displayScore(score, quizData.length)
	  
}

function displayScore(score, total){
	let resultPercent = (score / total) * 100;
	const main = document.getElementById('main');
	const existingScore = document.querySelector('.score');
	if (existingScore) existingScore.remove();
	const scoreElement = document.createElement('p');
	scoreElement.classList.add('score');
	scoreElement.innerText = `You scored ${score} out of ${total} (${resultPercent.toFixed(2)}%)`;
	main.appendChild(scoreElement);
}

function updateQuestionResult(optionElement, questionElement, isCorrect){
	addStatusIcon(optionElement, isCorrect);
	updateQuestionStatusColor(questionElement, isCorrect);
}

function addStatusIcon(parentElement, isSuccess) {
    if (!parentElement) return;

    // Remove any existing icon
    const existingIcon = parentElement.parentElement.querySelectorAll('.status-icon').forEach(foundElement => foundElement.remove());

    // Create a new span for the icon
    const icon = document.createElement('span');
    icon.classList.add('status-icon');
    icon.style.marginLeft = '8px';
    icon.style.fontWeight = 'bold';
    icon.style.color = isSuccess ? 'green' : 'red';
    icon.textContent = isSuccess ? '✔' : '✖';

    // Append it next to the parent content
    parentElement.appendChild(icon);
}

function updateQuestionStatusColor(questionElement, isPass){
	if (!questionElement) return;
	
	questionElement.style.backgroundColor = '';
	questionElement.style.backgroundColor = isPass ? '#90EE90' : '#FF7F7F'
}