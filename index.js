const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let wordList = [];
let minLength = 1;

function askMinLength() {
  rl.question("Enter the minimum word length (1-10): ", (input) => {
    const num = parseInt(input.trim());
    if (isNaN(num) || num < 1 || num > 10) {
      console.log("❌ Please enter a valid number between 1 and 10.");
      askMinLength();
    } else {
      minLength = num;
      collectWords();
    }
  });
}

function collectWords() {
  console.log(
    `\nPlease enter at least 8 words (min length: ${minLength} letters).`
  );

  function askForWord(count) {
    rl.question(`Enter word #${count + 1}: `, (input) => {
      const word = input.trim().toLowerCase();

      if (/\d/.test(word)) {
        console.log("❌ Word cannot contain numbers.");
      } else if (word === "" || word.length < minLength) {
        console.log(`❌ Word must be at least ${minLength} letters long.`);
      } else if (wordList.includes(word)) {
        console.log(
          "❌ This word is already in the list. Please enter a different word."
        );
      } else {
        wordList.push(word);
      }

      if (wordList.length < 8) {
        askForWord(wordList.length);
      } else {
        console.clear();
        console.log("Great! Here's the word list: ", wordList);
        startGame();
      }
    });
  }

  askForWord(wordList.length);
}

function startGame() {
  const secretWord = wordList[Math.floor(Math.random() * wordList.length)];

  const maxAttempts = 3;
  let wonGame = false;
  let attempts = 0;

  function askGuess() {
    rl.question("Guess the word:\n", (input) => {
      if (input === "" || input === " ") {
        console.log("❌ Enter one of the words from the word bank!");
      } else if (input.length !== secretWord.length) {
        console.log(
          `❌ Wrong Guess. Hint: word length is ${secretWord.length} letters.`
        );
        attempts++;
      } else if (input.toLowerCase() === secretWord) {
        console.log("🎉 Correct! You guessed the word!");
        wonGame = true;
        askPlayAgain();
      } else {
        console.log("❌ Wrong guess. Try again.");
        attempts++;
      }

      if (attempts < maxAttempts && !wonGame) {
        askGuess();
      } else if (!wonGame) {
        console.log(`💀 Out of attempts! The word was: ${secretWord}`);
        askPlayAgain();
      }
    });
  }

  function askPlayAgain() {
    rl.question("Wanna play again? (yes/no): ", (input) => {
      if (input.toLowerCase() === "yes") {
        console.clear();
        console.log("Here's the word list: ", wordList);
        startGame();
      } else {
        console.log("👋 Thanks for playing! Goodbye!");
        rl.close();
      }
    });
  }

  askGuess();
}

askMinLength();
