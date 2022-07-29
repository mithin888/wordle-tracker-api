import fetchUsers from "./fetchUsers.js";

const calcAvgScore = (userId, data) => {
  // user array filtered from master array via userID
  const userArray = data.filter(element => element.userId === userId);

  // score array extracted from user array
  const scoreArray = userArray.map(element => {
    if (element.text.substring(11, 12) === 'X') {
      return 7;
    } else {
      return parseInt(element.text.substring(11, 12));
    }
  });
  // score sum and calculation fixed to two decimal points
  const calcAvg = (scoreArray) => {
    if (scoreArray.length === 0) {
      return 0;
    }
    const scoreSum = scoreArray.reduce((acc, curr) => acc + curr);
    return (scoreSum / scoreArray.length).toFixed(2);
  };
  const score = calcAvg(scoreArray);
  return score;
};


const calcAvgScores = async (data) => {
  const users = await fetchUsers(process.env.WORDLE_CHANNEL_ID);
  const userScores = users.reduce((result, user) => {
    if (!user.is_bot) {
      result.push({
        id: user.id,
        image_url: user.profile.image_original,
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
        score: calcAvgScore(user.id, data)
      });
    }
    return result;
  }, []);
  const filteredUserScores = userScores.filter(user => user.score > 0);
  return filteredUserScores;
};

// return object with date and individual score given an array of entries
export const calcRawScores = async (data) => {
  const rawScores = data.map(entry => {
    const fullDate = new Date(entry.timestamp * 1000);
    const date = fullDate.getDate();
    const month = fullDate.getMonth() + 1;
    const indexOf = entry.text.indexOf('/');
    const score = entry.text.substring(indexOf - 1, indexOf);
    return ({
      ...entry,
      score: score,
      date: `${month}/${date}`,
      full_date: fullDate,
    });
  });
  return rawScores;
};

export default calcAvgScores;





