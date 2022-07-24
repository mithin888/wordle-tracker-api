import React, { useEffect, useState } from "react";

import data from "../coverage/wordle.json";

import User from "./User.js";



const UserList = () => {

  const array = data.filter(element => element.timestamp);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchMatchData = async () => {
      const response = await fetch(`http://localhost:3000/users`);
      const userList = await response.json();
      console.log(userList.users);
      setUsers(userList.users);
    };
    fetchMatchData();
  }, []);

  const findScore = (userStats) => {
    console.log(userStats);
    return userStats;
  };



  return (
    <React.Fragment>
      {users.map(user => {
        if (user.is_bot) {
          return;
        } else {
          return (
            <User
              key={user.id}
              id={user.id}
              name={user.real_name}
              score={findScore}
            />);
        }
      })}
    </React.Fragment>
  );
};

export default UserList;