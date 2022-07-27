import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/database.js";
import client from "../lib/mongoDB.js";

import ExpressError from "../utils/ExpressError.js";


const fetchData = async (filter) => {

  // <------------ Weekly ------------>
  // returns start of week for given a date string MM/DD/YYYY. Default date is now
  const getMonday = (dateString = Date.now()) => {
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  // start of week in Unix Timestamp
  const unixStartOfWeek = Math.floor(getMonday().getTime() / 1000.0).toString();


  // <------------ Monthly ------------>
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const startOfMonth = new Date(`${month}/01/${year}`);
  const unixStartOfMonth = Math.floor(startOfMonth.getTime() / 1000.0).toString();

  // <------------ Fetching ------------>
  let qParam;
  if (filter === 'weekly') {
    qParam = unixStartOfWeek;
  } else if (filter === 'monthly') {
    qParam = unixStartOfMonth;
  } else if (filter === 'all') {
    qParam = '1649823583.508359';
  } else {
    throw new ExpressError(`${filter} is not a valid parameter for /leaderboard`, 400);
  }

  // // <--------- Firebase Fetch --------->
  // // Create a reference to the all collection
  // const allRef = collection(db, "all");
  // // Create a query against the collection
  // const q = query(allRef, where("timestamp", ">", qParam));
  // const querySnapshot = await getDocs(q);
  // const data = [];
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   data.push(doc.data());
  // });
  // return data;

  // <--------- MongoDB Fetch --------->
  const mongoFetch = async () => {
    try {
      await client.connect();
      const database = client.db("wordle-tracker");
      const all = database.collection("all");
      // query for entries that have a timestamp greater than the query parameter
      const query = { timestamp: { $gt: qParam } };
      const cursor = all.find(query);
      // print a message if no documents were found
      if ((await all.estimatedDocumentCount()) === 0) {
        console.log("No documents found!");
      }
      const data = [];
      await cursor.forEach(item => {
        data.push(item);
      });
      return data;
    } finally {
      await client.close();
    }
  };
  const data = mongoFetch().catch(console.dir);
  return data;
};


// manual query for json data
export const filterData = (filterString) => {
  let today = new Date('05/16/2022');

  let filter;
  if (filterString === 'weekly') {
    filter = new Date(today.setDate(today.getDate() - 7));
  }
  if (filterString === 'monthly') {
    filter = new Date(today.setDate(today.getDate() - 30));
  }

  // must reset today because the today gets mutated in the above 2 lines
  today = new Date('05/16/2022');
  console.log(today);
  console.log(filter);

  const filteredData = data.filter(element => {
    const elementDate = new Date(element.timestamp * 1000);
    if (elementDate > filter && elementDate < today) {
      return elementDate;
    }
  });
  return filteredData;

};

export default fetchData;