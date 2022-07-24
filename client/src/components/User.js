

import data from "../coverage/wordle.json";

const User = props => {

  const dataArray = data.filter(element => element.timestamp);

  // user array filtered from master array via userID
  const userArray = dataArray.filter(element => element.userId === props.id);

  // score array extracted from user array
  const scoreArray = userArray.map(element => {
    if (element.text.substring(11, 12) === 'X') {
      return 0;
    } else {
      return parseInt(element.text.substring(11, 12));
    }
  });

  // score sum and calculation fixed to two decimal points
  const score = (scoreArray) => {
    if (scoreArray.length === 0) {
      return 0;
    }
    const scoreSum = scoreArray.reduce((acc, curr) => acc + curr);
    return (scoreSum / scoreArray.length).toFixed(2);
  };

  const avg = score(scoreArray);

  props.score({
    userId: props.id,
    name: props.name,
    score: avg
  });

  return (
    <li>
      {props.name}: {avg}
    </li>
  );

};

export default User;