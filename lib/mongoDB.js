import 'dotenv/config';
import { MongoClient } from "mongodb";

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
let uri;
if (process.env.NODE_ENV !== "production") {
  uri = 'mongodb://localhost:27017/wordle-tracker';
} else {
  uri = `mongodb+srv://admin:${process.env.PASSWORD}@${process.env.CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
}

const client = new MongoClient(uri);

await client.connect();
console.log('Successfully connected to MongoDB Database!');

export default client;
