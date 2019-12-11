const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  return Math.random().toString(36).substring('0', '8').replace('0.', '')
}
generateRandomString();

app.set("view engine", "ejs");

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

app.get("/urls/new", (req, res) => { 
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]     
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.post("/urls", (req, res) => {
  let randStr = generateRandomString();
  urlDatabase[randStr] = req.body.longURL
  res.redirect("/urls");         
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");         
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
    const longURL = req.body.edited
    urlDatabase[shortURL] = longURL;
  res.redirect("/urls");         
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});