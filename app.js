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

// initializing bodyParser for raw body
const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};
const jsonParser = bodyParser.json({
  verify: rawBodySaver
});
app.use(cors());


app.get("/user/:userId/:filter", jsonParser, requestAuth, catchAsync(async (req, res, next) => {
  const { userId, filter } = req.params;
  const filteredData = await fetchData(filter, userId);
  const rawScores = await calcRawScores(filteredData);
  res.status(200).send(rawScores);
}));

app.get("/leaderboard/:filter", jsonParser, requestAuth, catchAsync(async (req, res, next) => {
  const { filter } = req.params;
  const filteredData = await fetchData(filter);
  const userScores = await calcAvgScores(filteredData);
  res.status(200).send(userScores);
}));

let isSleeping = true;
app.post("/slack/events", jsonParser, async (req, res) => {
  const raw = req.rawBody;
  console.log(raw);
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
const port = process.env.PORT || 3080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});