import fetchUsers from "./fetchUsers.js";

import data from "../seeds/wordle.json" assert {type: 'json'};

const dataArray = data.filter(element => element.timestamp);

const calcScore = (userId) => {
  // user array filtered from master array via userID
  const userArray = dataArray.filter(element => element.userId === userId);

  // score array extracted from user array
  const scoreArray = userArray.map(element => {
    if (element.text.substring(11, 12) === 'X') {
      return 0;
    } else {
      return parseInt(element.text.substring(11, 12));
    }
  });
  // score sum and calculation fixed to two decimal points
  const calcScore = (scoreArray) => {
    if (scoreArray.length === 0) {
      return 0;
    }
    const scoreSum = scoreArray.reduce((acc, curr) => acc + curr);
    return (scoreSum / scoreArray.length).toFixed(2);
  };

  const score = calcScore(scoreArray);

  return score;
};


const createUserScores = async (channelId) => {
  const users = await fetchUsers(channelId);
  const userScores = users.reduce((result, user) => {
    if (!user.is_bot) {
      result.push({
        id: user.id,
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
        score: calcScore(user.id)
      });
    }
    return result;
  }, []);
  return userScores;
};

export default createUserScores;





