const express = require("express");
const app = express();
const port = 6202;

let wordList = [];
let secretWord = "";
let attempts = 0;
let maxAttempts = 3;
let wonGame = false;

app.use(express.json());
app.use(express.static("public")); // For serving static files (like HTML, CSS)

function startGame() {
  secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  attempts = 0;
  wonGame = false;
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Welcome to the Word Guess Game!</h1>
        <form action="/add-word" method="POST">
          <label>Enter word:</label>
          <input type="text" name="word" required>
          <button type="submit">Add Word</button>
        </form>
        <p>Word List: ${wordList.join(", ")}</p>
      </body>
    </html>
  `);
});

app.post("/add-word", (req, res) => {
  const word = req.body.word.toLowerCase();

  if (/\d/.test(word)) {
    return res.send("❌ Word cannot contain numbers. <a href='/'>Go Back</a>");
  }

  if (wordList.includes(word)) {
    return res.send(
      "❌ This word is already in the list. <a href='/'>Go Back</a>"
    );
  }

  wordList.push(word);

  if (wordList.length < 8) {
    return res.send(`
      Word added! You need to add ${8 - wordList.length} more words.
      <a href='/'>Go Back</a>
    `);
  } else {
    startGame();
    return res.send(`
      Great! Here's the word list: ${wordList.join(", ")}
      <form action="/guess" method="POST">
        <label>Guess the word:</label>
        <input type="text" name="guess" required>
        <button type="submit">Submit Guess</button>
      </form>
    `);
  }
});

app.post("/guess", (req, res) => {
  const guess = req.body.guess.toLowerCase();

  if (guess.length !== secretWord.length) {
    return res.send(`
      ❌ Please enter exactly ${secretWord.length} letters.
      <a href='/'>Try Again</a>
    `);
  }

  if (guess === secretWord) {
    wonGame = true;
    return res.send(`
      🎉 Correct! You guessed the word! 
      Wanna play again? <a href='/'>Yes</a> | <a href='/add-word'>No</a>
    `);
  }

  attempts++;

  if (attempts >= maxAttempts) {
    return res.send(`
      💀 Out of attempts! The word was: ${secretWord}
      Wanna play again? <a href='/'>Yes</a> | <a href='/add-word'>No</a>
    `);
  }

  res.send(`
    ❌ Wrong guess. Try again.
    <form action="/guess" method="POST">
      <label>Guess the word:</label>
      <input type="text" name="guess" required>
      <button type="submit">Submit Guess</button>
    </form>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on https://67.220.85.146:${port}`);
});
