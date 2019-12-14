const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('./helper');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['ayy', 'what', 'up', 'my', 'dudes', 'it is wednesday'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(function(req, res, next) {
  res.locals.user_id = req.session.user_id || false;
  next();
});


// ----------  FUNCTIONS ---------- //

function generateRandomString() {
  return Math.random().toString(36).substring('0', '8').replace('0.', '');
}
// Generates random string for user_id and shortURL

function urlsForUser(id) {
  const filteredDatabase = {};

  for (let shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];
    if (url.userID === id)
      filteredDatabase[shortURL] = url;
  }
  return filteredDatabase;
}
// Filter URL Database and check all short and long URLs per user id

// ----------  DATABASES ---------- //

const users = {
  'elB92y': {
    id: 'elB92y',
    email: 'user@example.com',
    password: 'user-password'
  },
  '9Sa3Bf': {
    id: '0Se7Gs',
    email: 'user2@example.com',
    password: 'user2password'
  }
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};


// ----------  GET ROUTES ---------- //

app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("urls_register", {user: null});
});

app.get("/login", (req, res) => {
  res.render("urls_login", {user: null});
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>🔐 You have to login first.</font face></h2>");
  }

  if (req.session.user_id) {
    const filteredDatabase = urlsForUser(req.session.user_id);
    //console.log(urlsForUser(req.session.user_id)) // Filter URL Database and check all short and long URLs per user id
    let templateVars = {
      user: user,
      urls: filteredDatabase
    };
    res.render("urls_index", templateVars);
    
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/new", (req, res) => {

  const userId = req.session.user_id;
  const user = users[userId];

  let templateVars = {
    user: user,
  };

  if (user) {
    return res.render("urls_new", templateVars);
  } else {
    res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>🔐 You have to <a href='/login'>Login</a> first.</font face></h2>");
    return res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {     // Not redirecting!

  if (!urlDatabase[req.params.shortURL]) {
    res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>👉 ShortURL not found!</font face></h2>");
  } else {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// Check urls database

app.get("/users.json", (req, res) => {
  res.json(users);
});
// Check users database


// ----------  POST ROUTES ---------- //

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();

  const findemail = getUserByEmail(email, users);
  if (email !== '' && password !== '' && !findemail) {
    //console.log(email, password); // Check user email and user password.
    const userObj = {
      id : id,
      email : email,
      password : hashPassword
    };
    // console.log(userObj); // Check user id, user email, and user hashedpassword.
    users[id] = userObj;
    req.session.user_id = id;
    res.redirect('/urls');

  } else if (email === '' || password === '') {
    res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>🔐 You cannot register without a valid email or a password. <a href='/register'>Try again!</a></font face></h2>");
  
  } else {
    res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>🔐 This email has been used already. <a href='/register'>try again!</a> with another email.</font face></h2>");
  }
});

app.post("/login", (req, res) => {

  const newEmail = req.body.email;
  const newPassword = req.body.password;

  if (req.body.password === '') {
    res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>🔑 You cannot login an account without a password.<a href='/login'>Try again!</a></font face></h2>");
  }
  
  for (const user_id in users) {
    if ((users[user_id].email === newEmail) && (bcrypt.compareSync(newPassword, users[user_id].password))) {
      users[user_id];
      req.session.user_id = user_id;
      res.redirect("/urls");
    }
  }
  res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>🔑 Your password is incorrect. <a href='/login'>Try again!</a>.</font face></h2>");
});

app.post("/urls", (req, res) => {
  if (req.body.longURL === '') {
    return res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>💻 URL not defined! Please, input the URL you want to shorten.</font face></h2>");
  }

  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL : req.body.longURL,
    userID : req.session.user_id
  };
  //console.log(newShortURL);  //Check short URL generated
  return res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  
  const userId = req.session.user_id;
  const user = users[userId];

  if (user) {
    // Delete selected short URLfrom URL Database according to user's id
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL", (req, res) => {

  const userId = req.session.user_id;
  const user = users[userId];
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;

  if (req.body.longURL === '') {
    return res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>💻 URL not defined! Please, input the URL you want to edit.</font face></h2>");
  }

  if (user) {
    urlDatabase[shortURL].longURL = longURL;
    return res.redirect('/urls');
  } else {
    return res.send("<h1><font face='arial'>⚠️ Ops, something went wrong!</h1><br><h2>🔐 To edit URLs, <a href='/login'>login</a> to your account first.</font face></h2>");
  }

});

app.post("/logout", (req, res) => {
  // Clean cookies
  req.session.user_id = null;
  res.redirect("/login");
});


// ----------  SERVER PORT ---------- //

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
