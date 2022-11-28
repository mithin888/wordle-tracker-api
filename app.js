// importing npm modules
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";

// importing custom modules
import saveScore from "./controllers/saveScoreMDB.js";
import calcAvgScores, { calcRawScores } from './controllers/fetchScore.js';
import fetchData from "./controllers/fetchData.js";

// importing middleware
import slackAuth from './middleware/slackAuth.js';
import requestAuth from './middleware/requestAuth.js';

// importing utility functions
import catchAsync from './utils/catchAsync.js';
import ExpressError from "./utils/ExpressError.js";

// initializing express and bodyParser
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/user/:userId/:filter", requestAuth, catchAsync(async (req, res, next) => {
  const { userId, filter } = req.params;
  const filteredData = await fetchData(filter, userId);
  const rawScores = await calcRawScores(filteredData);
  res.status(200).send(rawScores);
}));

app.get("/leaderboard/:filter", requestAuth, catchAsync(async (req, res, next) => {
  const { filter } = req.params;
  const filteredData = await fetchData(filter);
  const userScores = await calcAvgScores(filteredData);
  res.status(200).send(userScores);
}));

let isSleeping = true;
app.post("/slack/events", slackAuth, catchAsync(async (req, res) => {
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
}));

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
let port;
if (process.env.NODE_ENV !== "production") {
  port = 3080;
} else port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
