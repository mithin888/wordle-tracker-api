

const slackAuth = (req, res, next) => {
  if (process.env.NODE_ENV != "production") {
    return next();
  }
};

export default slackAuth;