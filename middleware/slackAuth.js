
const slackAuth = (req, res, next) => {
  // if (process.env.NODE_ENV != "production") {
  //   return next();
  // }
  next();
};

export default slackAuth;