import { fetchDisplayName } from "./fetchUsers.js";
import client from "../lib/mongoDB.js";

const saveScore = async (req, res) => {
  // conditional for correct message to be stored
  if (req.body.event) {
    if (req.body.event.text != undefined && req.body.event.text.includes("Wordle")) {

      async function run() {
        try {
          await client.connect();
          const database = client.db("wordle-tracker");
          const all = database.collection("all");
          // Query for a movie that has the title 'The Room'
          const query = { timestamp: { $eq: req.body.event.ts } };
          const doc = await all.findOne(query);
          // since this method returns the matched document, not a cursor, print it directly
          console.log("<-- Start Query Result -->");
          console.log(doc);
          console.log("<-- End Query Result -->");

          // conditional for trimming duplicate entries
          if (!doc) {
            console.log("This message does not yet exist in the database");

            // formatting message
            const displayName = await fetchDisplayName(req.body.event.user);
            const indexOf = req.body.event.text.indexOf("Wordle");
            const message = {
              timestamp: req.body.event.ts,
              userId: req.body.event.user,
              user: displayName,
              text: req.body.event.text.substring(indexOf, indexOf + 15).replace("\n", "")
            };

            // adding to database
            const result = await all.insertOne(message);
            console.log(`A message was inserted with the _id: ${result.insertedId}`);
            console.log(message);
          } else console.log("This message already exists in the database");

        } finally {
          await client.close();
        }
      }
      run().catch(console.dir);
    }
  }
};

export default saveScore;
