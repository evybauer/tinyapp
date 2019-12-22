const getUserByEmail = function(email, database) {
  for (let user in database) {
  if (database[user].email === email) {
    return database[user].id;
    }
  }
  return null;
};

function generateRandomString() {
  return Math.random().toString(36).substring('0', '8').replace('0.', '');
}
// Generates random string for user_id and shortURL


function urlsForUser(id, urlDatabase) {
  const filteredDatabase = {};

  for (let shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];
    if (url.userID === id)
      filteredDatabase[shortURL] = url;
  }
  return filteredDatabase;
}
// Filter URL Database and check all short and long URLs per user id


module.exports = { getUserByEmail, generateRandomString, urlsForUser };
