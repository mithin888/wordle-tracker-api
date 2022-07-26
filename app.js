// importing npm modules
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";

// importing custom modules
import saveScore from "./controllers/saveScore.js";
import fetchUsers from "./controllers/fetchUsers.js";
import createUserScores from './controllers/fetchScore.js';
import fetchData from "./controllers/fetchData.js";
import catchAsync from './utils/catchAsync.js';
import ExpressError from "./utils/ExpressError.js";


// initializing express and bodyParser
const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

app.get("/leaderboard/:filter", jsonParser, catchAsync(async (req, res, next) => {
  console.log('request received');
  const { filter } = req.params;
  const filteredData = await fetchData(filter);
  const userScores = await createUserScores(filteredData);
  res.status(200).send({
    users: userScores,
  });
}));

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

// catch all for invalid routes
app.all('*', (req, res, next) => {
  next(new ExpressError('Resource Not Found', 404));
});

// responds with an error object for invalid requests
app.use((error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = 'Oh No, Something went wrong!';
  res.status(statusCode).send(error);
});

// configuring server port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});