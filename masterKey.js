// Unified masterKey structure
const masterKey = [
  {
    bookName: "NFPA 211",
	folder: "NFPA_211",
    quizDictionary: [
      { quizName: "NFPA 211 - Chapter 1: Administration", fileName: "chapter1.js" },
      { quizName: "NFPA 211 - Chapter 2: Referenced Publications", fileName: "chapter2.js" },
      { quizName: "NFPA 211 - Chapter 3: Definitions", fileName: "chapter3.js" },
      /*
      { quizName: "NFPA 211 - Chapter 4: General Requirements", fileName: "chapter4.js" },
      { quizName: "NFPA 211 - Chapter 5: Selection of Chimney and Vent Types", fileName: "chapter5.js" },
      { quizName: "NFPA 211 - Chapter 6: Factory-Built Chimneys and Chimney Units", fileName: "chapter6.js" },
      { quizName: "NFPA 211 - Chapter 7: Masonry Chimneys", fileName: "chapter7.js" },
      { quizName: "NFPA 211 - Chapter 8: Unlisted Metal Chimneys (Smokestacks) for Nonresidential Applications", fileName: "chapter8.js" },
      { quizName: "NFPA 211 - Chapter 9: Chimney Connectors and Vent Connectors", fileName: "chapter9.js" },
      { quizName: "NFPA 211 - Chapter 10: Vents", fileName: "chapter10.js" },
      { quizName: "NFPA 211 - Chapter 11: Fireplaces", fileName: "chapter11.js" },
      { quizName: "NFPA 211 - Chapter 12: Masonry Heaters", fileName: "chapter12.js" },
      { quizName: "NFPA 211 - Chapter 13: Solid Fuel-Burning Appliances", fileName: "chapter13.js" },
      { quizName: "NFPA 211 - Chapter 14: Maintenance", fileName: "chapter14.js" },
      { quizName: "NFPA 211 - Chapter 15: Inspection of Existing Chimneys", fileName: "chapter15.js" }
      */
    ]
  },
  {
    bookName: "Chimney and Venting Essentials",
	folder: "ChimneyAndVentingEssentials",
    quizDictionary: [
      { quizName: "Chapter 1: Role of the Modern Chimney Technician", fileName: "chapter1.js" },
      { quizName: "Chapter 2: Codes, Standards & Regulations", fileName: "chapter2.js" },
      { quizName: "Chapter 3: Health and Safety at the Job Site", fileName: "chapter3.js" },
	  { quizName: "Chapter 4: Tools and Equipment", fileName: "chapter4.js" },
	  { quizName: "Chapter 5: Basic Theories", fileName: "chapter5.js" },
	  { quizName: "Chapter 6: Professional Etiquette", fileName: "chapter6.js" },
	  { quizName: "Chapter 7: Identifying Appliance And Venting System Types", fileName: "chapter7.js" },
	  { quizName: "Chapter 8: Inspecting the Appliance", fileName: "chapter8.js" },
	  { quizName: "Chapter 9: Inspecting the Venting System", fileName: "chapter9.js" },
	  { quizName: "Chapter 10: Sweeping the Chimney: Introduction", fileName: "chapter10.js" },
	  { quizName: "Chapter 11: Sweeping Masonry Fireplace Chimneys", fileName: "chapter11.js" },
	  { quizName: "Chapter 12: Sweeping Factory-Built Fireplace Chimneys", fileName: "chapter12.js" },
	  { quizName: "Chapter 13: Sweeping Freestanding Stove Chimneys", fileName: "chapter13.js" },
	  { quizName: "Chapter 14: Sweeping Hearth Stove or Fireplace Insert Chimneys", fileName: "chapter14.js" },
	  { quizName: "Chapter 15: Sweeping Pellet Appliance Chimneys or Vents", fileName: "chapter15.js" },
	  { quizName: "Chapter 16: Sweeping Gas and Oil Appliance Chimneys or Vents", fileName: "chapter16.js" }
	  { quizName: "Chapter 17: Sweeping Masonry Heaters", fileName: "chapter17.js" },
	  { quizName: "Chapter 18: Troubleshooting", fileName: "chapter18.js" },
	  /*
	  { quizName: "Chapter 19: Documentation", fileName: "chapter19.js" },
	  { quizName: "Chapter 20: Advising the Customer and Maintenance", fileName: "chapter20.js" },
	  */
    ]
  }
];

if (!window.masterKey) window.masterKey = masterKey;
window.masterKey = masterKey;

// Test function
function validateQuizAnswers() {
  if (!window.masterKey || !window.quizRegistry) {
    console.error("masterKey or quizRegistry not found!");
    return;
  }

  window.masterKey.forEach(book => {
    const { bookName, quizDictionary } = book;
	let totalQuestionCount = 0;
    quizDictionary.forEach(quiz => {
      const quizData = window.quizRegistry[quiz.quizName];
	  let invalidCount = 0;
	  let questionCount = 0;
	  
      if (!quizData) {
        console.warn(`No quiz data found for ${bookName} / ${quiz.quizName}`);
        return;
      }

      quizData.forEach((question, index) => {
		questionCount++;
		totalQuestionCount++;
        if (!question.options.includes(question.answer)) {
          console.log(
            `Invalid answer detected:\n` +
            `Book: ${bookName}\n` +
            `Quiz: ${quiz.quizName}\n` +
            `Question #${index + 1}: ${question.question}\n` +
            `Answer: ${question.answer}\n` +
            `Options: ${question.options.join(", ")}`
          );
          invalidCount++;
        }
      });
	  if (invalidCount === 0) {
		console.log(`(${questionCount-invalidCount}/${questionCount}) | '${bookName} | ${quiz.quizName}' All answers are valid!`);
	  } else {
		console.warn(`(${questionCount-invalidCount}/${questionCount}) | '${bookName} | ${quiz.quizName}' ${invalidCount} invalid answer(s) found.`);
	  }
    });
	console.log (`${bookName} | Total of ${totalQuestionCount} questions\n\n\n`);
  });


}
