import client from "../lib/mongoDB.js";
import ExpressError from "../utils/ExpressError.js";

const fetchData = async (filter, userId = '') => {

  let qParam;
  const integer = +filter;
  // <------------ Last n Days  ------------>
  if (Number.isInteger(+filter)) {
    const date = new Date(Date.now());
    date.setDate(date.getDate() - integer);
    const unixStart = Math.floor(date.getTime() / 1000.0).toString();
    qParam = unixStart;
  }

  // <------------ Weekly ------------>
  else if (filter === 'weekly') {
    // returns start of week for given a date string MM/DD/YYYY. Default date is now
    const getMonday = (dateString = Date.now()) => {
      const date = new Date(dateString);
      const day = date.getDay();
      const diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(date.setDate(diff));
      return new Date(`${monday.getMonth() + 1}/${monday.getDate()}/${monday.getFullYear()}`);
    };
    // start of week in Unix Timestamp
    const unixStartOfWeek = Math.floor(getMonday().getTime() / 1000.0).toString();
    qParam = unixStartOfWeek;
  }

  // <------------ Monthly ------------>
  else if (filter === 'monthly') {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const startOfMonth = new Date(`${month}/01/${year}`);
    const unixStartOfMonth = Math.floor(startOfMonth.getTime() / 1000.0).toString();
    qParam = unixStartOfMonth;
  }

  // <------------ All ------------>
  else if (filter === 'all') {
    qParam = '1649823583.508359';
  }

  // <------------ Timestamp specific ------------>
  else if (filter > '1649823583.508359') {
    qParam = filter;
  }
  else {
    throw new ExpressError(`${filter} is not a valid parameter for /leaderboard`, 400);
  }

  // <--------- MongoDB Fetch --------->
  const mongoFetch = async () => {
    try {
      const database = client.db("wordle-tracker");
      const all = database.collection("all");

      // query for entries that have a timestamp greater than the query parameter and optinally filters by userId
      const query = {
        timestamp: { $gt: qParam },
      };
      userId ? (query.userId = { $eq: userId }) : "";

      const cursor = all.find(query);
      // print a message if no documents were found
      if ((await all.estimatedDocumentCount()) === 0) {
        console.log("No documents found!");
      }
      const data = await cursor.toArray();
      return data;
    } catch (error) {
      console.error('Connection to MongoDB failed', error);
    }
  };
  const data = mongoFetch();
  return data;
};

export default fetchData;