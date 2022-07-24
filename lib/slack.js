import { WebClient, LogLevel } from "@slack/web-api";

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.OAUTH_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  // logLevel: LogLevel.DEBUG
});

export default client;