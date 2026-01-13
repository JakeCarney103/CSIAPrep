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
    ]
  }
];

if (!window.masterKey) window.masterKey = masterKey;
window.masterKey = masterKey;