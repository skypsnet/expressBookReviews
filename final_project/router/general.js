const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();

const promiseBooks = new Promise((resolve, reject)=>{
     setTimeout(() => {
       resolve(books);
     }, 3000);
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  promiseBooks.then((books)=>{
    return res.status(200).json(books);
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params

  promiseBooks.then((books)=>{
    return res.status(200).json(books[isbn]);
  });
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const arrbooks = await promiseBooks;
  const booksKeys = Object.keys(arrbooks);
  const authorSame = [];

  booksKeys.forEach((e)=>{
      if(arrbooks[e].author === author){
          authorSame.push(arrbooks[e]);
      }
  })

  return res.status(200).json(authorSame);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const arrbooks = await promiseBooks;
  const titleKeys = Object.keys(arrbooks);
  const titleSame = [];

  titleKeys.forEach((e)=>{

    if(arrbooks[e].title === title){
         titleSame.push(arrbooks[e]);
    }

  });

  return res.status(200).json(titleSame);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const booksKeys = Object.keys(books);
  
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
