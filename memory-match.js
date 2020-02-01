//const url = 'https://raw.githubusercontent.com/words/an-array-of-english-words/master/words.json';

const NUMBER_OF_CARDS = 16; //Number of cards to be displayed on game board
var cards;
var timerInterval;

//Words which populate on Game Board
const words = ['GOD', 'INFOSYS', 'GOOD', 'PRODUCT', 'LANDT', 'LUNCH', 'FRIENDS',
    'COCONUT', 'FLOWER', 'BAT', 'BALL', 'DUCK', 'PEACOCK', 'PEN', 'PENCIL', 'TRY', 'CATCH', 'XEROX', 'BEAUTIFUL', 'TEMPARATURE'];
//var words; 
//const words = ['A', 'E', 'I', 'O', 'U'];

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


var answerArray = [];   //Holds answer
var selectedCardArray = [];  //Holds user selected cards
var attemptsCount = 0;   //How many attempts taken to complete the level
var isFirstClick = true;   //To start timer on first click of card
var currentLevel = 1;   //Current level of the game 

/*Timer related variables*/
var hours = 0, minutes = 0, seconds = 0;

var playedWordsSet = new Set(); //Words which are played on different levels

/* Get words by calling an API 

function getWords() {
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        words = data.map(word => word.toUpperCase());
        loadCards();
    }).catch(function () {
        console.log("Error in fetching words from API...");
    });
}
*/

/* Loads card on game board */

function loadCards() {
    let currentWord = generateWord();
    answerArray = [...currentWord]; //Splits the selected word into Characters Array

    document.querySelector(".level-section").innerHTML = "Level : " + currentLevel;
    document.getElementById("word").innerHTML = "Find the Word : " + currentWord;

    /*Dynamically create cards based on the number provided*/
    var fragment = document.createDocumentFragment();

    var cardsDiv = document.createElement('div');
    cardsDiv.className = 'cards';

    for (let outerCardIndex = 0; outerCardIndex < NUMBER_OF_CARDS; outerCardIndex++) {
        var cardDiv = document.createElement('div');
        cardDiv.className = 'card'

        var frontFaceDiv = document.createElement('div');
        frontFaceDiv.className = 'front-face';
        cardDiv.appendChild(frontFaceDiv);
        var backFaceDiv = document.createElement('div');
        backFaceDiv.className = 'back-face';
        var spanElement = document.createElement('span');
        spanElement.className = 'backface-font';

        //Set Answer charaters to card
        if (answerArray[outerCardIndex]) {
            backFaceDiv.setAttribute('value', answerArray[outerCardIndex]);
            spanElement.innerHTML = answerArray[outerCardIndex];
        }

        //Fill rest of the cards with random letters
        else {
            let randomChar = alphabets[Math.floor(Math.random() * alphabets.length)];
            backFaceDiv.setAttribute('value', randomChar);
            spanElement.innerHTML = randomChar;
        }

        backFaceDiv.append(spanElement);
        cardDiv.appendChild(backFaceDiv);
        cardsDiv.appendChild(cardDiv);
        fragment.appendChild(cardsDiv);

    }
    document.getElementById('cont').appendChild(fragment);
    cards = document.querySelectorAll('.card');
    //Once cards are loaded to game board it should be in shuffled order
    shuffleCards();

    setTimeout(() => {
        cards.forEach(card => card.addEventListener('click', showCard));
    }, 3000)

}

/*Selects a random word from word array
which is not yet played */
function generateWord() {
    let isWordFound = false;
    let currentWord;
    while (!isWordFound) {
        let randomWordIndex = Math.floor(Math.random() * words.length);
        currentWord = words[randomWordIndex];
        if (!playedWordsSet.has(currentWord)) {
            playedWordsSet.add(currentWord);
            isWordFound = true;
        }
    }
    return currentWord;
}

var timer = document.querySelector(".timer-section");

function startTimer() {
    timerInterval = setInterval(() => {
        timer.innerHTML = minutes + " mins " + ": " + seconds + " secs";
        seconds++;

        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }

        if (minutes == 60) {
            hours++;
            minutes = 0;
        }
    }, 1000);
}


function showCard() {

    if (isFirstClick) {
        isFirstClick = false;
        startTimer();
    }
    this.classList.add('flip', 'disabled');//Card should be disabled once it is opened

    let selectedCard = this;
    selectedCardArray.push(selectedCard);

    if (selectedCardArray.length == answerArray.length) {
        cards.forEach(card => card.classList.add('disabled'));
        let isCorrect = checkAnswers(selectedCardArray);
        setTimeout(() => {
            if (isCorrect) {
                alert("Congrats !!! Right Answer!!!");
                attemptsCount = hours = minutes = seconds = 0;
                isFirstClick = true;
                currentLevel++;
                //All levels completed
                if (playedWordsSet.size === words.length) {
                    alert("Congrats !!! You have completed all levels...");
                    currentLevel = 1;
                    playedWordsSet.clear();
                }
                updateAttemptsCount(attemptsCount);
                updateLevelsCount(currentLevel);
                resetBoard(true);

            }
            else {
                alert("Sorry Wrong Answer!!!");
                setTimeout(() => {
                    attemptsCount++;
                    updateAttemptsCount(attemptsCount);
                    resetBoard(false);
                }, 1000);
            }
        }, 800);
    }
}

/*Checks selected cards are equal to answer card array*/
function checkAnswers(selectedCardArray) {
    let allSelectedCards = [];
    let selectedCardsLength = selectedCardArray.length;

    for (let cardIndex = 0; cardIndex < selectedCardsLength; cardIndex++) {
        let selectedCard = selectedCardArray[cardIndex].getElementsByClassName('back-face')[0].getAttribute('value');
        allSelectedCards.push(selectedCard);
    }

    if (JSON.stringify(allSelectedCards) === JSON.stringify(answerArray)) {
        return true;
    }
    else {
        return false;
    }
}

function updateAttemptsCount(attemptsCount) {
    document.querySelector('.attempts').innerHTML = 'Attempts : ' + attemptsCount;
}

function updateLevelsCount(currentLevel) {
    document.querySelector(".level-section").innerHTML = "Level : " + currentLevel;
}

function resetBoard(isLevelCompleted) {

    selectedCardArray.forEach(card => card.classList.remove('flip'));
    selectedCardArray = [];
    cards.forEach(card => {
        card.classList.remove('disabled');
    })
    //Load and Shuffle cards only if level or game is completed.
    if (isLevelCompleted) {
        clearInterval(timerInterval);
        timer.innerHTML = minutes + " mins " + ": " + seconds + " secs";
        let container = document.getElementById('cont');
        while (container.hasChildNodes())
            container.removeChild(container.childNodes[0]);
        loadCards();
        shuffleCards();
    }
}

function shuffleCards() {
    setTimeout(() => {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * cards.length);
            card.style.order = randomPos;
            card.classList.add('rotate');
        })
    }, 1000)


    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('rotate');
        })
    }, 2000)
}


