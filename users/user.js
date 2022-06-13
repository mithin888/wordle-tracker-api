// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
import { WebClient, LogLevel } from "@slack/web-api";

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.OAUTH_TOKEN, {
});

let userDisplayName = async (userId) => {
  try {
    // Call the users.info method using the WebClient
    const userInfo = await client.users.info({
      user: userId
    });

    // Returns display name of the user
    if (!userInfo.user.profile.display_name.length > 0) {
      return userInfo.user.profile.real_name;
    } else return userInfo.user.profile.display_name;

  }
  catch (error) {
    console.error(error);
  }
};

export default userDisplayName;

