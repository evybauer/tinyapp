const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['ayy', 'what', 'up', 'my', 'dudes', 'it is wednesday'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(function(req, res, next) {
  res.locals.user_id = req.session.user_id || false;
  next();
});

//////////////////////////////////////////////
// HELPER FUNCTIONS

function generateRandomString() {
  return Math.random().toString(36).substring('0', '8').replace('0.', '');
}
generateRandomString();


function checkEmail(email) {
  for (let user_id in users) {
    if((users[user_id].email === email)){
      return true;
    }
  }
  return false;
}

///////////////////////////////////////////
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

///////////////////////////////////////////

// GET REQUESTS

app.get("/", (req, res) => {
  res.send("Hello!");
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
  const filteredUrlDatabase = {};

  if (!user) {
  return res.redirect("login");
  }

  for (shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];

    if (url.userID === user.id) {
      filteredUrlDatabase[shortURL] = url;
    }
  }
  //urlsForUser(id)

  const templateVars = {
    user: user,
    urls: filteredUrlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  const userId = req.session.user_id;
  const user = users[userId];

  let templateVars = {
    user: user,
  };

  if (user) {
    console.log("users object", users);
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
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
    res.status(400)
  } else {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/users.json", (req, res) => {
  res.json(users);
});


//POST REQUESTS

app.post("/register", (req, res) => {

  const newEmail = req.body.username;
  const newPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  //console.log("what is req.body", req.body);
  if (newPassword === '') {
    return res.sendStatus(400);
  }

  if (checkEmail(newEmail)) {
    return res.status(400).send('Not Found! We already have an account registered with this email!'); 
  }

  //console.log("what is email password", newEmail, newPassword);
  for (let user_id in users) {
    //console.log("on key ", user_id);
    //console.log("indexing user", users[user_id].email);
    if (users[user_id].email !== newEmail) {
      let user_id = generateRandomString();
      users[user_id] = {
        id: user_id,
        email: req.body.username,
        password: hashedPassword
      };
      console.log('id: ' + user_id)
      console.log('email: ' + req.body.username)
      console.log('password: ' + hashedPassword)
      

      foundEmail = users[user_id];
      // console.log("users object", users);

      //res.cookie('user_id', user_id);
      req.session.user_id = user_id
      return res.redirect("/urls");

    } else {
      res.sendStatus(400);
    }
  }
});


app.post("/login", (req, res) => {

  const newEmail = req.body.username;
  const newPassword = req.body.password;

  if (req.body.password === '') {
    res.sendStatus(400);
  }
  
  for (const user_id in users) {
    //console.log("on key ", user_id);
    //console.log("indexing user", users[user_id].email);
    if ((users[user_id].email === newEmail) && (bcrypt.compareSync(newPassword, users[user_id].password))) {
      foundEmail = users[user_id];
      //console.log("users object", users);
      //res.cookie('user_id', user_id);
      req.session.user_id = user_id
      res.redirect("/urls");
    }
  }
  res.sendStatus(404);
});

app.post("/urls", (req, res) => {

  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL : req.body.longURL,
    userID : req.session.user_id
  };
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  
  const userId = req.session.user_id;
  const user = users[userId];

  if (user) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL", (req, res) => {

  const userId = req.session.user_id;
  const user = users[userId];
  let longURL = req.body.longURL;
  let shortURL = req.params.shortURL;

  if (user) {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.status(400).send('Please login to edit your urls.');
  }
});

app.post("/logout", (req, res) => {
  //res.clearCookie('user_id');
  req.session.user_id = null;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
