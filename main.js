import "./style.css";
import { Questions } from "./questions";

const TIMEOUT = 4000;
const app = document.querySelector("#app");
const startButton = document.querySelector("#start");

startButton.addEventListener("click", startQuiz);

// fonction de démarrage du quiz
function startQuiz(event) {
  event.stopPropagation();
  let currentQuestion = 0;
  let score = 0;

  displayQuestion(currentQuestion);

  // masquer les éléments (h1, bouton start)
  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length - 1, currentQuestion);
    app.appendChild(progress);
  }

  // afficher les questions
  function displayQuestion(index) {
    clean();
    const question = Questions[index];

    if (!question) {
      displayFinishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);
    app.appendChild(submitButton);
  }

  // afficher le message de fin
  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! Tu as terminé le quiz.";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} points sur ${Questions.length}.`;
    app.appendChild(h1);
    app.appendChild(p);
  }

  // fonction qui récupère l'élément sélectionné et vérifie s'il correspond à la réponse juste
  function submit() {
    const selectedAnswer = app.querySelector('input[name="answer"]:checked');

    disableAllInputs();

    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;
    // alert(`Ta réponse est ${isCorrect ? "correcte" : "fausse"}`);

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value); /*!!!*/
    const feedback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);

    displayNextQuestionButton(() => {
      currentQuestion++;
      displayQuestion(currentQuestion);
    });
  }

  // afficher les réponses
  function createAnswers(answers) {
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answersDiv.appendChild(label);
    }
    return answersDiv;
  }
}

// création du text des questions
function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

// fonction de formatage du texte récupéré du tableau de questions
function formatId(text) {
  //   return text.replaceAll(" ", "-").toLowerCase(); // génère une erreur
  return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

//creation des réponses et des boutons radio
function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

// création du bouton de vérification de la réponse
function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Vérifier";
  return submitButton;
}
// la création du bouton a été déportée dans une fonction
/*const submitButton = document.createElement("button");
  submitButton.innerText = "vérifier";*/

// afficher la réponse
function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );
  const selectedAnswerId = formatId(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

function getFeedbackMessage(isCorrect, correct) {
  const paragraphe = document.createElement("p");
  paragraphe.innerText = isCorrect
    ? "Bravo ! C'est la bonne réponse"
    : `Désolé... la bonne réponse était ${correct}`;
  return paragraphe;
}

// barre de progression
function getProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  return progress;
}

// masquer le bouton "vérifier" après le clic, après un délai
// et passage à la question suivante
function displayNextQuestionButton(callback) {
  let remainingTimeout = TIMEOUT;
  app.querySelector("button").remove();
  const getButtonText = () => `Next (${remainingTimeout / 1000}s)`;
  const nextButton = document.createElement("button");
  nextButton.innerText = getButtonText();
  app.appendChild(nextButton);
  const interval = setInterval(() => {
    remainingTimeout -= 1000;
    nextButton.innerText = getButtonText();
  }, 1000);
  const timeout = setTimeout(() => {
    handleNextQuestion();
  }, TIMEOUT);
  const handleNextQuestion = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    callback();
  };
  nextButton.addEventListener("click", () => {
    handleNextQuestion();
  });
}

// désactive les boutons radio après soumission de la réponse
function disableAllInputs() {
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  for (const radio of radioInputs) {
    radio.disabled = true;
  }
}
