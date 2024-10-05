const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let check = false
  users.filter((user) => {
    if (user.username === username) {
      check = true;
      return ;
    }
  });
  return check;
}

const authenticatedUser = (username,password)=>{
  let check = false
  users.filter((user) => {
    if (user.username === username && user.password === password) {
      check = true
      return ;
    }
  });
  return check;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  
  if (!isValid(username)) {
    return res.send(username + ' is not valid');
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password,
    }, 'access', { expiresIn: 60 * 60});
    req.session.authorization = {
      accessToken, username
    }
    return res.send(username + ' login success');
  } else {
    return res.send('password not correct');
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookId = req.params.isbn;
  const username = req.session.authorization['username'];
  if (bookId in books) {
    books[bookId].reviews[username] = req.query.review;
    return res.send(`review ${bookId} successfully`);
  } else {
      return res.send(`${bookId} doesn't define`);
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bookId = req.params.isbn;
  const username = req.session.authorization['username'];
  if (bookId in books) {
    if (books[bookId].reviews[username]) {
      delete books[bookId].reviews[username];
      return res.send(`delete review ${bookId} successfully`);
    } else {
      return res.send(`not found review ${bookId} from ${username}`);
    }
  } else {
      return res.send(`${bookId} doesn't define`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
