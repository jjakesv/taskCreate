const express = require("express");
const app = express();
const port = 6202; // Set the port to 6202
const host = "67.220.85.146"; // Set the host IP address

let wordList = [];

app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); // To parse JSON data (if needed)
app.use(express.static("public")); // Serve static files like HTML, CSS

function collectWords() {
  console.log("Please enter at least 8 words to add to the word list.");

  function askForWord(count) {
    app.get("/add-word", (req, res) => {
      res.send(`
        <form action="/add-word" method="POST">
          <label>Enter word #${count + 1}:</label>
          <input type="text" name="word" required>
          <button type="submit">Add Word</button>
        </form>
      `);
    });
  }

  askForWord(wordList.length);
}

app.post("/add-word", (req, res) => {
  const word = req.body.word.trim().toLowerCase();

  if (/\d/.test(word)) {
    return res.send(
      "❌ Word cannot contain numbers. <a href='/add-word'>Go Back</a>"
    );
  }

  if (wordList.includes(word)) {
    return res.send(
      "❌ This word is already in the list. <a href='/add-word'>Go Back</a>"
    );
  }

  wordList.push(word);

  if (wordList.length < 8) {
    return res.send(`
      Word added! You need to add ${8 - wordList.length} more words.
      <a href='/add-word'>Go Back</a>
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

function startGame() {
  const secretWord = wordList[Math.floor(Math.random() * wordList.length)];

  const maxAttempts = 3;
  let wonGame = false;
  let attempts = 0;

  app.post("/guess", (req, res) => {
    const guess = req.body.guess.trim().toLowerCase();

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
}

app.listen(port, () => {
  //console.log(`Server is running on http://${host}:${port}`);
});
