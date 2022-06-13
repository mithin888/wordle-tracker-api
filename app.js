// importing npm modules
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

// importing custom modules
import saveScore from "./controllers/saveScore.js";

// initializing express and bodyParser
const app = express();
const jsonParser = bodyParser.json();

app.set('view engine', 'ejs');


app.get("/", async (req, res) => {
  res.render('index');
});

let isSleeping = true;
app.post("/slack/events", jsonParser, async (req, res) => {
  if (req.body.challenge) {
    const challenge = req.body.challenge;
    res.status(200).json({
      challenge: challenge
    });
  } else if (!isSleeping) {
    res.sendStatus(200);
    // saving incoming Wordle Score from wordle channel
    saveScore(req, res);
  } else if (isSleeping) {
    res.sendStatus(503);
    isSleeping = false;
  }

});

app.all("*", (req, res, next) => {
  res.sendStatus(404);
});

// configuring server port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});