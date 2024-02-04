const keyboardDiv = document.querySelector(".keyboard");
const inputs = document.querySelector(".inputs"),
  hintTag = document.querySelector(".hint span"),
  guessLeft = document.querySelector(".guess-left span"),
  wrongLetter = document.querySelector(".wrong-letter span"),
  scoreDisplay = document.querySelector(".score span"),
  resetBtn = document.querySelector(".reset-btn"),
  typingInput = document.querySelector(".typing-input"),
  clueBtn = document.querySelector(".clue-btn");
  difficultyParagraph = document.querySelector(".difficulty span"); // New line added


  let word, maxGuesses, incorrectLetters = [], correctLetters = [], score = 0;
  let questionCounter = 0; // Counter to track the number of questions answered correctly
  let currentDifficulty = "Easy"; // Variable to track the current difficulty level
  
  function randomWord() {
    let filteredWords = wordList.filter(item => item.difficulty === currentDifficulty);
    let ranItem = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    word = ranItem.word;
  maxGuesses = 3;
  correctLetters = [];
  incorrectLetters = [];
  hintTag.innerText = ranItem.hint;
  guessLeft.innerText = maxGuesses;
  wrongLetter.innerText = incorrectLetters;
  document.querySelector(".score span").innerText = score;


    // Set the difficulty text content
    difficultyParagraph.innerText = ranItem.difficulty;

    let html = "";
    const consonantClueBtn = document.querySelector(".clue-btn.consonant-clue-btn");
    const vowelClueBtn = document.querySelector(".clue-btn.vowel-clue-btn");
    for (let i = 0; i < word.length; i++) {
      html += `<input type="text" disabled>`;
      inputs.innerHTML = html;
    }
  }
  

function initGame(e) {
  let key = e.target.value.toLowerCase();
  if (key.match(/^[A-Za-z]+$/) && !incorrectLetters.includes(` ${key}`) && !correctLetters.includes(key)) {
    if (word.includes(key)) {
      for (let i = 0; i < word.length; i++) {
        if (word[i] == key) {
          correctLetters.push(key);
          inputs.querySelectorAll("input")[i].value = key;
        }
      }
    } else {
      maxGuesses--;
      incorrectLetters.push(` ${key}`);
    }
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters;
  }
  typingInput.value = "";

  setTimeout(() => {
    if (correctLetters.length === word.length) {
      score += 10;
      scoreDisplay.innerText = score;
      alert(`Congrats! You guessed the word ${word.toUpperCase()}\nScore: ${score}`);
      questionCounter++;
  
      if (questionCounter >= 10) {
        changeDifficulty();
        questionCounter = 0;
      }
  
      return randomWord();
    } else if (maxGuesses < 1) {
      alert(`Game over! You don't have remaining guesses.\nScore: ${score}`);
      for (let i = 0; i < word.length; i++) {
        inputs.querySelectorAll("input")[i].value = word[i];
      }
      score = 0;
      scoreDisplay.innerText = score;
    }
  }, 100);

  function changeDifficulty() {
    // Implement the logic to change the difficulty level here
    // For example, you can choose the next difficulty from a predefined list
    // and update the difficultyParagraph.innerText accordingly
    // Here, it's set to "Easy" initially and then cycles between "Medium" and "Hard"
    if (currentDifficulty === "Easy") {
      currentDifficulty = "Medium";
    } else if (currentDifficulty === "Medium") {
      currentDifficulty = "Hard";
    } else {
      currentDifficulty = "Easy";
    }
  
    difficultyParagraph.innerText = currentDifficulty; // Update the difficulty display
  }}

  
const cluesLeftContainer = document.querySelector(".clues-left span");
let clueUses = 0; // Add this variable to keep track of clue uses

function useClue(clueType) {
    if (score >= 25 && clueUses < 3) {
      let unrevealedIndices = [];
      for (let i = 0; i < word.length; i++) {
        if (!correctLetters.includes(word[i])) {
          unrevealedIndices.push(i);
        }
      }
  
      if (unrevealedIndices.length > 0) {
        score -= 25;
        scoreDisplay.innerText = score;
        let randomIndex;
        if (clueType === "consonant") {
          const consonantIndices = unrevealedIndices.filter(index => !isVowel(word[index]));
          if (consonantIndices.length > 0) {
            randomIndex = consonantIndices[Math.floor(Math.random() * consonantIndices.length)];
          }
        } else if (clueType === "vowel") {
          const vowelIndices = unrevealedIndices.filter(index => isVowel(word[index]));
          if (vowelIndices.length > 0) {
            randomIndex = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
          }
        }
  
        if (randomIndex !== undefined) {
          correctLetters.push(word[randomIndex]);
          inputs.querySelectorAll("input")[randomIndex].value = word[randomIndex];
        }
  
        clueUses++;
        cluesLeftContainer.innerText = 3 - clueUses; // Update the clues left display
      }
    } else {
        if (clueUses >= 3) {
          alert("You have already used the clue 3 times!");
        } else if (score < 25) {
            alert("Not enough points to use the clue!");
          } else if (score > 25) {
            alert("Using points for Clue");
          }
        }
    }

  // Helper function to check if a character is a vowel
function isVowel(char) {
    return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
  }

// Use clues for consonants and vowels
const consonantClueBtn = document.querySelector(".consonant-clue-btn");
const vowelClueBtn = document.querySelector(".vowel-clue-btn");

consonantClueBtn.addEventListener("click", () => useClue("consonant"));
vowelClueBtn.addEventListener("click", () => useClue("vowel"));
resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());
clueBtn.addEventListener("click", useClue);

// Initial game start
randomWord();
