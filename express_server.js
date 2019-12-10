const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

function generateRandomString() {
  return Math.random().toString(36).substring('0', '8').replace('0.', '')
}
generateRandomString();

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { // POSITION!!!
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.post("/urls", (req, res) => {
  const randStr = generateRandomString();
  urlDatabase[randStr] = {
    longURL: req.body.longURL,
    shortURL: req.body.shortURL
  }
  res.render("/urls/:shortURL");         
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});