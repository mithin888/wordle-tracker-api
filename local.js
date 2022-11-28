import app from "./src/app.js"

// configuring server port
let port;
process.env.NODE_ENV !== "production" ? port = 3080 : process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
