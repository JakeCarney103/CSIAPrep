const nfpaQuizSelectorDictionary = [
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
  /*
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
  */
];

const chimneyAndVentingEssentialsQuizSelectorDictionary = [
  {
    quizName: "Chapter 1: Role of the Modern Chimney Technician",
    fileName: "chapter1.js",
  },
  {
    quizName: "Chapter 2: Codes, Standards & Regulations",
    fileName: "chapter2.js",
  },
  
    quizName: "Chapter 3: Health and Safety at the Job Site",
    fileName: "chapter3.js",
  },
];

const bookSelectionOptions = [
	{
		bookName: "NFPA 211"
	},
	{
		bookName: "Chimney and Venting Essentials"
	}
];

document.addEventListener('DOMContentLoaded', function() {
  loadBookSelectionOptions();
});

function loadBookSelectionOptions(){
	const main = document.getElementById('main');
	const div = document.createElement('div');
		div.classList.add('block');
		const quizSelectionQuestion = document.createElement('p');
		quizSelectionQuestion.classList.add('selectionQuestion');
		quizSelectionQuestion.innerHTML = 'Select the book you would like to take quizzes against!';
		div.appendChild(quizSelectionQuestion);
	bookSelectionOptions.forEach(book =>{
		const label = document.createElement('label');
		label.classList.add('options');
		label.innerHTML = `<input type='radio' name='bookSelection' value='${book.bookName}'> ${book.bookName}`;
		div.appendChild(label);
		div.appendChild(document.createElement('br'));
	});
	main.appendChild(div);
	const viewQuizOptionsButton = document.createElement('button')
	viewQuizOptionsButton.textContent = 'View Quiz Options!'
	viewQuizOptionsButton.type = 'button';
	viewQuizOptionsButton.onclick = function() {
		const selected = document.querySelector('input[name="bookSelection"]:checked');
		if (selected)
		{
			const selectedBookInfo = bookSelectionOptions.find(book => book.bookName === selected.value);
			if (selectedBookInfo){
				clearMainForm();
				loadQuizSelectionOptions(selectedBookInfo);
			}else{
				alert ("This book isn't defined, please select another!")
			}
		}
		else
		{
			alert("Please select a Book!");
		}
	}
	main.appendChild(viewQuizOptionsButton);
}

function loadQuizSelectionOptions(selectedBookInfo){
	const quizSelectorDictionary = selectedBookInfo.bookName === 'NFPA 211' ? nfpaQuizSelectorDictionary : chimneyAndVentingEssentialsQuizSelectorDictionary;
	const main = document.getElementById('main');
	const div = document.createElement('div');
		div.classList.add('block');
		const quizSelectionQuestion = document.createElement('p');
		quizSelectionQuestion.classList.add('selectionQuestion');
		quizSelectionQuestion.innerHTML = 'Select the quiz you would like to take!';
		div.appendChild(quizSelectionQuestion);
	quizSelectorDictionary.forEach(quiz =>{
		const label = document.createElement('label');
		label.classList.add('options');
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
				loadQuiz(selectedQuizInfo, selectedBookInfo);
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
	
	const backToBookSelectionButton = document.createElement('button')
	backToBookSelectionButton.textContent = 'Back to Book Selection'
	backToBookSelectionButton.type = 'button';
	backToBookSelectionButton.classList.add('back-button');
	backToBookSelectionButton.onclick = function() {
		clearMainForm();
		loadBookSelectionOptions();
	}
	main.appendChild(backToBookSelectionButton);
}

function clearMainForm(){
	const mainForm = document.getElementById('main');
	mainForm.innerHTML = '';
}

function loadQuiz(selectedQuizInfo, selectedBookInfo){
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
		submitQuiz(selectedQuizInfo, shuffledQuizData);
	}
	main.appendChild(submitQuizButton);
	
	const backToQuizSelectionButton = document.createElement('button')
	backToQuizSelectionButton.textContent = 'Back to Quiz Selection'
	backToQuizSelectionButton.type = 'button';
	backToQuizSelectionButton.classList.add('back-button');
	backToQuizSelectionButton.onclick = function() {
		clearMainForm();
		loadQuizSelectionOptions(selectedBookInfo);
	}
	main.appendChild(backToQuizSelectionButton);

}


function submitQuiz(selectedQuizInfo, overallQuizData) {
      let score = 0;
	  let unanswered = 0;
      overallQuizData.forEach((q, index) => {
        const selected = document.querySelector(`input[name='q${index}']:checked`);
		if (!selected){
			unanswered++;
		}else{
			let optionElement = selected.parentElement;
			let questionElement = optionElement.parentElement.querySelector('.question');
			if(selected.value === q.answer) { 
			score++;
			updateQuestionResult(optionElement, questionElement, true);
			}else{
				updateQuestionResult(optionElement, questionElement, false);
			}
		}
      });
	  
	displayScore(score, overallQuizData.length, unanswered)
	  
}

function updateQuestionResult(optionElement, questionElement, isCorrect){
    addStatusIcon(optionElement, isCorrect);
    const blockDiv = questionElement.closest('.block');
    if(blockDiv) {
        blockDiv.classList.remove('correct', 'incorrect');
        blockDiv.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
}

function displayScore(score, total, unanswered){
    let resultPercent = (score / total) * 100;
    const main = document.getElementById('main');
    const existingScore = document.querySelector('.score');
    if (existingScore) existingScore.remove();

    const scoreElement = document.createElement('p');
    scoreElement.classList.add('score');
    if(unanswered > 0) scoreElement.classList.add('warning');

    scoreElement.innerText = unanswered === 0 
        ? `You scored ${score} out of ${total} (${resultPercent.toFixed(2)}%) ✅`
        : `You scored ${score} out of ${total} (${resultPercent.toFixed(2)}%) ⚠️ You have ${unanswered} unanswered question(s)!`;

    main.appendChild(scoreElement);
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

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}