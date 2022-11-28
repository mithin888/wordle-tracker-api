// Utility function to catch errors specifically in async functions so that it can be passed on to "next" 

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

export default catchAsync;