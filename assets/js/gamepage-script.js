// Retrieve all the relevant objects from the HTML through the DOM.
const pictureContainer = "";
const answerContainer = document.getElementById("answer-buttons");
const ansContainer1 = document.getElementById("answer-1"); // Want to rename these, but need to change throughout the document. 
const ansContainer2 = document.getElementById("answer-2");
const ansContainer3 = document.getElementById("answer-3");
const ansContainer4 = document.getElementById("answer-4");
const questionImage = document.getElementById("img-answer");

console.log(questionImage);

const timerContainer = document.getElementById("start-btn"); // This needs changing when a new element is built.
const scoreContainer = document.getElementById("next-btn"); // This needs changing when a new element is built.

// This function will run both API functions, and return the place name and photo of the right answer in an array. 
async function getLocation() {
    const newLocation = await getGeoName();
    const locationPhoto = await getPhoto(newLocation[0]);
    const newLocString = `${newLocation[0]}, ${newLocation[1]}`;
    return [newLocString, locationPhoto];
}

function getGeoName(){
    var queryURL = 'http://dataservice.accuweather.com/locations/v1/topcities/50?apikey=nqkAVAuvzGPmrydtswPleNqPjEwoDmOJ';
    let randomNumber = Math.floor(Math.random() * 49);
    var array=[]
    return fetch(queryURL)
        .then((res) => res.json())
        .then((data) => {
          let country = data[randomNumber].Country.LocalizedName;
          let city = data[randomNumber].LocalizedName
          array.push(city, country)
          return (array);
        })
}

function getPhoto(city) {
        var queryURL = 'https://api.unsplash.com/search/photos?query='+city+'&client_id=1tOjV5-F3U0hFpgkRGZtFpfT_LjrRVAzn3Ho6t522oQ';
        let randomNumber = Math.floor(Math.random() * 5);
          return fetch(queryURL)
            .then((response) => response.json())
            .then((data) => {
              let allImages = data.results[randomNumber];
              return (allImages.urls.regular)
            });
    }
    
// This will run the GeoNames API function 3 times, and make sure the same result isn't selected.
async function getOtherLocations () {
    const threeCities = [];
    while (threeCities.length != 3) {
        const newCity = await getGeoName();
        if (!threeCities.includes(newCity)) {
            threeCities.push(`${newCity[0]}, ${newCity[1]}`);
        }
    }
    return threeCities;
}

// Function to generate an object that contains the image and all four answers.
async function generateQuestionObject() {
    const correctLocation = await getLocation();
    const otherLocations = await getOtherLocations();
    const questionObject = {
        image: correctLocation[1],
        answer1: correctLocation[0],
        answer2: otherLocations[0],
        answer3: otherLocations[1],
        answer4: otherLocations[2],
    }
    
    return questionObject;
}

// Function to push the answer options to the HTML in a random order.
async function generateNewQuestion () {
    const questionObject = await generateQuestionObject();
    const allAnswers = [questionObject.answer1, questionObject.answer2, questionObject.answer3, questionObject.answer4];
    const allPlacements = [ansContainer1, ansContainer2, ansContainer3, ansContainer4];
    const usedPlacements = [];

    const correctPlacement = Math.floor(Math.random() * 4);
    allPlacements[correctPlacement].innerHTML = allAnswers[0];
    allPlacements[correctPlacement].setAttribute("class", "btn correct");
    
    usedPlacements.push(allPlacements[correctPlacement]);

    while (usedPlacements.length < 4) {
        const nextPosition = Math.floor(Math.random() * 4);
        const nextPlacement = allPlacements[nextPosition];
        const nextAnswer = usedPlacements.length;
        if (!usedPlacements.includes(nextPlacement)) {
            nextPlacement.innerHTML = allAnswers[nextAnswer];
            nextPlacement.setAttribute("class", "btn incorrect");
            usedPlacements.push(nextPlacement);
        }
    }
    const photo = questionObject.image;
    console.log(photo);
    questionImage.style.backgroundImage = `url(${photo})`;
}
generateNewQuestion();

// Function to store and display scores.
let score = 0;

// Event listener for answer container. 
const answerChosen = event => {
    const answerPicked = event.target;
    const correctAnswer = document.querySelector(".correct");
    if (answerPicked === correctAnswer) {
        score++; // This needs to be pushed to the page, currently no container for it. 
    } else {
        score--; // This needs to be pushed to the page.
    };
    scoreContainer.innerText = score;
    secondsLeft = 15;
    generateNewQuestion();
}
answerContainer.addEventListener("click", answerChosen);

// Timer that resets with each new question.
startTimer();
let secondsLeft = 15;
function startTimer() {
    const timerInterval = setInterval(function () {
      timerContainer.innerHTML = secondsLeft + " seconds remaining.";
      secondsLeft--;
      if (secondsLeft < 0) {
        secondsLeft = 15;
        score--;
        scoreContainer.innerText = score;
        pushQuestions(questionObject);
        pushPhotograph();
      }
    }, 1000);
  }

// Function to collect user input / their name.
// Function to push high scores and username to local storage.
// Function to retrieve high scores and username from local storage.
// Function to restart the game.