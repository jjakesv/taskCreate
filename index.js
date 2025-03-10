const readline = require("readline");

const webindex = require("./webindex");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let wordList = [];

function collectWords() {
  console.log("Please enter at least 8 words to add to the word list.");

  function askForWord(count) {
    rl.question(`Enter word #${count + 1}: `, (input) => {
      const word = input.trim().toLowerCase();

      if (/\d/.test(word)) {
        console.log("❌ Word cannot contain numbers.");
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
      if (input.length !== secretWord.length) {
        console.log(`❌ Please enter exactly ${secretWord.length} letters.`);
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

collectWords();
