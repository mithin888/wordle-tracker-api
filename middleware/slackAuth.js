import ExpressError from "../utils/ExpressError.js";

const slackAuth = (req, res, next) => {
  if (req.body.token != process.env.SLACK_TOKEN) {
    throw new ExpressError('Unauthorized', 401);
  } next();
};

export default slackAuth;