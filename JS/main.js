// start section declaration
const startSection = document.querySelector(".start-section");
const slider = document.querySelector(".start-section .slider");
const sliderValue = document.querySelector(
  ".start-section .slider-container p"
);
const startQuizBtn = document.querySelector(".start-section .start-btn");
const categoriesMenu = document.querySelector(".start-section .categories");
const categorySelector = document.querySelectorAll(".start-section .selector");
const options = document.querySelector(".start-section .categories .options");
const exitQuizBtn = document.querySelector(".start-section .exit-ins");
const continueBtn = document.querySelector(".start-section .continue");
const insWindow = document.querySelector(".start-section .ins-window");
const insNumberOfQuestions = document.querySelector(
  ".start-section .ins-window .number-of-questions"
);
const insErrorMsg = document.querySelector(".ins-window .error-msg");
const qErrorMsg = document.querySelector(".quiz-window .error-msg");
const correct = document.querySelector(".correct");
const wrong = document.querySelector(".wrong");
let selectedCategory = "";
// quiz section declaration
const loading = document.querySelector(".loader-container");
const quizSection = document.querySelector(".quiz-section");
const quizWindow = document.querySelector(".quiz-window");
const questionContent = document.querySelector(".question p");
const answersContainer = document.querySelector(".question-container .answers");
const submitBtn = document.querySelector(".quiz-window .submit-btn");
const nextBtn = document.querySelector(".quiz-window .next-btn");
const resultBtn = document.querySelector(".quiz-window .result-btn");
const resultSection = document.querySelector(".result-section");
const scoreField = document.querySelector(".result-window .score .score-val");
const rNumberOfQuestionsField = document.querySelector(
  ".result-window .score .number-of-questions"
);
const quitQuizBtn = document.querySelector(".result-window .quit");
const timerContainer = document.querySelector(".timer-container");
const timer = document.querySelector(".timer-container .timer");
let numberOfQuestions = slider.value;
let randomQuestions = [];
let qNumber = 0;
let submitState = false;
let counter = 15;
let score = 0;
// start 'start section' ----------------------------------------------
sliderValue.textContent = slider.value;
insNumberOfQuestions.textContent = slider.value;
rNumberOfQuestionsField.textContent = slider.value;
slider.addEventListener("input", function () {
  numberOfQuestions = this.value;
  sliderValue.textContent = this.value;
  insNumberOfQuestions.textContent = this.value;
  rNumberOfQuestionsField.textContent = this.value;
});
startQuizBtn.addEventListener("click", () => {
  startQuizBtn.style.display = "none";
  categoriesMenu.style.display = "none";
  insWindow.classList.remove("close");
  insWindow.classList.add("active");
});
// exit instructions window btn
exitQuizBtn.addEventListener("click", () => {
  startQuizBtn.style.display = "block";
  categoriesMenu.style.display = "block";
  insWindow.classList.remove("active");
  insWindow.classList.add("close");
  insErrorMsg.classList.remove("active");
});
// hide/appear categories menu
document.body.addEventListener("click", (e) => {
  if ([...categorySelector].includes(e.target)) {
    categoriesMenu.classList.toggle("active");
  } else {
    categoriesMenu.classList.remove("active");
    return;
  }
});
// show up the selected category
categoriesMenu.addEventListener("click", (e) => {
  const categories = document.querySelectorAll(".start-section .options li");
  if ([...categories].includes(e.target)) {
    categoriesMenu.querySelector(".category p").textContent =
      e.target.textContent;
    selectedCategory = e.target.textContent;
  }
});
// continue button's job
continueBtn.addEventListener("click", () => {
  if (selectedCategory) {
    startSection.classList.add("close");
    loading.classList.remove("close");
    loading.firstElementChild.style.display = "block";
    insWindow.classList.remove("active");
    insWindow.classList.remove("close");
    getRandomQuestions();
  } else {
    insErrorMsg.classList.add("active");
  }
});
// start 'quiz section' ----------------------------------------------
// submitting the selected or none selected answers
submitBtn.addEventListener("click", () => {
  submitAnswer();
  if (qNumber === randomQuestions.length) {
    state = false;
    submitBtn.style.display = "none";
    resultBtn.classList.add("active");
    nextBtn.classList.remove("active");
    qNumber = 0;
  }
});
// skip or next question button
nextBtn.addEventListener("click", () => {
  if (qNumber < randomQuestions.length) {
    showQuestionDetails(randomQuestions);
  }
});
// show the final result
resultBtn.addEventListener("click", () => {
  quizSection.classList.remove("active");
  resultBtn.classList.remove("active");
  resultSection.classList.add("active");
  scoreField.textContent = score;
});
// close result window and get back to the start window
quitQuizBtn.addEventListener("click", () => {
  selectedCategory = "";
  randomQuestions = [];
  categoriesMenu.querySelector(".category p").textContent = "Categories";
  resultSection.classList.remove("active");
  startSection.classList.remove("close");
  startQuizBtn.style.display = "block";
  categoriesMenu.style.display = "block";
});
// getting the categories and putting them in the categories menu
async function getCategories() {
  try {
    let categories = await fetch("./JS/questions.json");
    categories = await categories.json();
    return categories;
  } catch (error) {
    return error;
  }
}
getCategories().then((categories) => {
  categories.forEach((category) => {
    const cat = document.createElement("li");
    cat.textContent = category.category;
    options.append(cat);
  });
});
// get questions function
function getRandomQuestions() {
  getCategories().then((categories) => {
    categories.forEach((category) => {
      if (selectedCategory === category.category) {
        for (let i = 0; i < numberOfQuestions; i++) {
          const questionIndex = Math.floor(
            Math.random() * category.data.length
          );
          if (randomQuestions.includes(category.data[questionIndex])) {
            i--;
            continue;
          }
          category.data[questionIndex].question = `${i + 1}. ${
            category.data[questionIndex].question
          }`;
          randomQuestions.push(category.data[questionIndex]);
        }
      }
    });
    showQuestionDetails(randomQuestions);
  });
}
// show questions one by one in the question window
function showQuestionDetails(questions) {
  answersContainer.textContent = "";
  const allTheQuestions = questions;
  const questionAnswers = [
    allTheQuestions[qNumber].correct_answer,
    ...allTheQuestions[qNumber].incorrect_answers,
  ].sort(() => Math.random() - 0.5);
  // questionAnswers = questionAnswers.sort(() => Math.random() - 0.5);
  questionContent.textContent = allTheQuestions[qNumber].question;
  for (let i = 0; i < questionAnswers.length; i++) {
    const answer = document.createElement("li");
    answer.textContent = questionAnswers[i];
    answersContainer.appendChild(answer);
  }
  selectAnswers();
  submitBtn.style.display = "block";
  nextBtn.classList.remove("active");
  quizWindow.classList.add("active");
}
// the selection of the answers
function selectAnswers() {
  const answers = document.querySelectorAll(".question-container .answers li");
  answers.forEach((answer) => {
    answer.addEventListener("click", () => {
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].classList.contains("selected"))
          answers[i].classList.remove("selected");
      }
      answer.classList.add("selected");
    });
  });
  countDownTimer();
}
// submit and next function
function submitAnswer() {
  const correctAnswer = randomQuestions[qNumber].correct_answer;
  let selectedAnswer = "";
  let correctAnswerElem = "";
  const answers = document.querySelectorAll(".question-container .answers li");
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].classList.contains("selected")) {
      selectedAnswer = answers[i];
    }
    if (answers[i].textContent === correctAnswer) {
      correctAnswerElem = answers[i];
    }
  }
  // if there's a selected answer or counter = 0
  if (selectedAnswer.textContent || !counter) {
    submitState = true;
    qErrorMsg.classList.remove("active");
    if (selectedAnswer.textContent) {
      if (selectedAnswer.textContent === correctAnswer) {
        selectedAnswer.style.backgroundColor =
          "var(--c-answers-background-color)";
        //appending the icon then showing it
        selectedAnswer.append(correct);
        selectedAnswer.firstElementChild.classList.add("active");
        score++;
      } else {
        //appending the icon then showing it
        selectedAnswer.append(wrong);
        selectedAnswer.firstElementChild.classList.add("active");
        selectedAnswer.style.backgroundColor =
          "var(--w-answers-background-color)";
        //appending the icon then showing it
        correctAnswerElem.append(correct);
        correctAnswerElem.firstElementChild.classList.add("active");
        correctAnswerElem.style.backgroundColor =
          "var(--c-answers-background-color)";
      }
    } else {
      for (let i = 0; i < answers.length; i++) {
        answers[i].style.backgroundColor = "var(--w-answers-background-color)";
      }
    }
    qNumber++;
    for (let i = 0; i < answers.length; i++) {
      answers[i].style.pointerEvents = "none";
    }
    submitBtn.style.display = "none";
    if (qNumber < randomQuestions.length) {
      nextBtn.classList.add("active");
    } else {
      resultBtn.classList.add("active");
    }
  } else {
    qErrorMsg.classList.add("active");
  }
}
// countdown timer function
function countDownTimer() {
  counter = 15;
  timer.style.backgroundColor = "var(--text-color)";
  let timerId = setInterval(() => {
    timer.textContent = --counter;
    if (counter === 5) {
      timer.style.backgroundColor = "red";
    }
    if (counter === 0) {
      submitBtn.click();
    }
    if (submitState) {
      clearInterval(timerId);
      submitState = false;
    }
  }, 1000);
  loading.classList.add("close");
  loading.firstElementChild.style.display = "none";
  quizSection.classList.add("active");
}
