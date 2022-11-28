import ExpressError from "../utils/ExpressError.js";

const requestAuth = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers.authorization != process.env.API_AUTH) {
      throw new ExpressError('Unauthorized', 401);
    }
  }
  return next();
};

export default requestAuth;
