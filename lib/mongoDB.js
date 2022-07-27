import 'dotenv/config';
import { MongoClient, ObjectId } from "mongodb";
import sample from "../seeds/wordle.json" assert {type: 'json' };


/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = `mongodb+srv://admin:${process.env.PASSWORD}@${process.env.CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

export default client;

