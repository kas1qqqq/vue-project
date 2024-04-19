interface QuestionsType {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const questions: QuestionsType[] = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris"],
    correctAnswer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5"],
    correctAnswer: "4",
  },
  {
    question: "In Vue 3, what is the new composition API used for?",
    options: [
      "Managing server-side routes",
      "Handling HTTP requests",
      "Managing state and logic in components",
    ],
    correctAnswer: "Managing state and logic in components",
  },
  {
    question: "In JavaScript, what primitive data type can hold whole numbers?",
    options: ["String", "Number", "Boolean"],
    correctAnswer: "Number",
  },
  {
    question:
      "In Vue 3, how can you create a reactive data property in a component?",
    options: [
      "Using the `ref` function from Vue composition API",
      "Using the `reactive` function from Vue composition API",
      "Using the `data` option in the component's options object",
    ],
    correctAnswer: "Using the `ref` function from Vue composition API",
  },
  {
    question: "What is the highest mountain in the solar system?",
    options: ["Mount Everest", "Olympus Mons", "K2"],
    correctAnswer: "Olympus Mons",
  },
  {
    question: "What is the largest living organism on Earth?",
    options: ["Blue Whale", "Giant Sequoia Tree", "African Bush Elephant"],
    correctAnswer: "Giant Sequoia Tree",
  },
  {
    question: "What is the currency of Japan?",
    options: ["Euro", "Yuan", "Yen"],
    correctAnswer: "Yen",
  },
  {
    question:
      "In CSS, what property controls the spacing between lines of text?",
    options: ["margin", "padding", "line-height"],
    correctAnswer: "line-height",
  },
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra"],
    correctAnswer: "Canberra",
  },
];

function randomizeQuestions(questions: QuestionsType[]) {
  return questions.sort(() => Math.random() - 0.5);
}

export const QUESTIONS = randomizeQuestions(questions);
