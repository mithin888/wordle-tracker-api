import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../lib/database.js";
import userDisplayName from "../users/user.js";

const saveScore = async (req, res) => {
  // conditional for correct message to be stored
  if (req.body.event) {
    if (req.body.event.text != undefined && req.body.event.text.includes("Wordle")) {
      const q = query(collection(db, "all"), where("timestamp", "==", req.body.event.ts));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log("<-- Start Query Result -->");
        console.log(doc.id, " => ", doc.data());
        console.log("<-- End Query Result -->");
      });
      // conditional for trimming duplicate entries
      if (querySnapshot.empty) {
        console.log("This message does not yet exist in the database");
        const displayName = await userDisplayName(req.body.event.user);
        const indexOf = req.body.event.text.indexOf("Wordle");
        const message = {
          timestamp: req.body.event.ts,
          userId: req.body.event.user,
          user: displayName,
          text: req.body.event.text.substring(indexOf, indexOf + 15).replace("\n", "")
        };
        const docRef = await addDoc(collection(db, "all"), message);
        console.log(`Saved --> ${docRef.id}`);
        console.log(message);
      } else console.log("This message already exists in the database");
    }
  }
};

export default saveScore;