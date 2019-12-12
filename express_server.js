const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


function generateRandomString() {
  return Math.random().toString(36).substring('0', '8').replace('0.', '');
}
generateRandomString();


app.set("view engine", "ejs");

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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


///////////////////////////////////////////


// GET REQUESTS

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  // access cookie to get user_id
  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  res.render("urls_register", {user: null});
});


app.get("/login", (req, res) => {
  res.render("urls_login", {user: null});
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



//POST REQUESTS

app.post("/urls", (req, res) => {
  const randStr = generateRandomString();
  urlDatabase[randStr] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.edited;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {

  const newEmail = req.body.username;
  const newPassword = req.body.password;

  console.log("\n\n\n\n");
  console.log(newEmail);
  console.log(newPassword);
  console.log("\n\n\n\n");

  if (req.body.password === '') {
    res.sendStatus(400);
  }
  
  for (const user_id in users) {
    console.log("on key ", user_id);
    console.log("indexing user", users[user_id].email);
    if (users[user_id].email === newEmail && (users[user_id].password === newPassword)) {
      foundEmail = users[user_id];
      console.log("users object", users);
      res.cookie('user_id', user_id);
      res.redirect("/urls");
    }
  }
  res.sendStatus(404);
});

app.post("/register", (req, res) => {

  const newEmail = req.body.username;
  const newPassword = req.body.password;
  console.log("what is req.body", req.body);
  if (newPassword === '') {
    res.sendStatus(400);
  }
  console.log("what is email password", newEmail, newPassword);
  for (let user_id in users) {
    console.log("on key ", user_id);
    console.log("indexing user", users[user_id].email);
    if (users[user_id].email !== newEmail && (newEmail !== '')) {
      let user_id = generateRandomString();
      users[user_id] = {
        id: user_id,
        email: req.body.username,
        password: req.body.password
      };
      foundEmail = users[user_id];
      console.log("users object", users);
      res.cookie('user_id', user_id);
      res.redirect("/urls");
    } else {
      res.sendStatus(400);
    }

  }

});




app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});