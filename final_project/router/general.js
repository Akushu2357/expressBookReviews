const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;

  if (isValid(username)) {
    return res.send(username + ' already exists');
  }
  users.push({'username': username, 'password': req.query.password});
  res.send('Complete the code for registering a new user (' + username + ')');
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //res.send(JSON.stringify(books)); //task 1
  new Promise((resolve,reject) => {
    resolve(JSON.stringify(books));
  }) .then(data => {
    res.send(data);
  }) .catch(error => {
    res.send({message: error});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //res.send(books[req.params.isbn]); //task2
  new Promise((resolve,reject) => {
    resolve(books[req.params.isbn]);
  }) .then(data => {
    res.send(data);
  }) .catch(error => {
    res.send({message: error});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  /*const author = req.params.author;
  let filtered_books = {};
  for (let bookId in books) {
    if (books[bookId].author === author) {
      filtered_books[bookId] = books[bookId];
    }
  }
  res.send(filtered_books);*/ //task3
  new Promise((resolve,reject) => {
    const author = req.params.author;
    let filtered_books = {};
    for (let bookId in books) {
      if (books[bookId].author === author) {
        filtered_books[bookId] = books[bookId];
      }
    }
    resolve(filtered_books);
  }) .then(data => {
    res.send(data);
  }) .catch(error => {
    res.send(error);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  /*const title = req.params.title;
  let filtered_books = {};
  for (let bookId in books) {
    if (books[bookId].title === title) {
      filtered_books[bookId] = books[bookId];
    }
  }
  res.send(filtered_books);*/ //task4
  new Promise((resolve,reject) => {
    const title = req.params.title;
    let filtered_books = {};
    for (let bookId in books) {
      if (books[bookId].title === title) {
        filtered_books[bookId] = books[bookId];
      }
    }
    resolve(filtered_books);
  }) .then(data => {
    res.send(data);
  }) .catch(error => {
    res.send(error);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookId = req.params.isbn;
  res.send(books[bookId].reviews);
});

module.exports.general = public_users;
