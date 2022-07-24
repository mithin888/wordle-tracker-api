import client from "../lib/slack.js";

// fetches User IDs and User Info given a channel ID
export const fetchUsers = async (channelId) => {
  const members = await fetchUserIds(channelId);
  const fullMembers = await Promise.all(members.map(async (member) => {
    return await fetchUserInfo(member);
  }));
  return fullMembers;
};

// fetches User IDs given a channel ID
export const fetchUserIds = async (channelId) => {
  const members = await client.conversations.members({
    channel: channelId
  });
  return members.members;
};

// fetches User Info given a User ID
export const fetchUserInfo = async (userId) => {
  const members = await client.users.info({
    user: userId
  });
  return members.user;
};

export default fetchUsers;