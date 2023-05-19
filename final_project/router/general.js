const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

const URL = "https://bvaameena-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/" 

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.status(300).json(books);
});

//Task 10: using async function to get all books
const getAllBooks = async () => {
    let retrievedBooks = await axios.get(URL)
    console.log(retrievedBooks)
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  return res.status(300).json(books[isbn]);
 });

 //Task 11
 const getBookByISBN = async () => {
     axios.get(URL + 'isbn/3')
        .then((data) => {
            console.log(data)
        })
 }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let filtered_books = []

  for (const [key, value] of Object.entries(books)) {
      //console.log(books[key])
      if(value.author === author) {
          filtered_books.push(value)
      }
  }
  res.status(200).json(filtered_books)
});

 //Task 12
 const getBookByAuthor = async () => {
    axios.get(URL + 'author/Unknown')
       .then((data) => {
           console.log(data)
       })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title

    for (const [key, value] of Object.entries(books)) {
        //console.log(books[key])
        if(value.title === title) {
            res.status(200).json({book: value})
        }
    }
    return res.status(300).json({message: "Title not found"});
});

 //Task 13
 const getBookByTitle = async () => {
    axios.get(URL + 'title/Fairy tales')
       .then((data) => {
           console.log(data)
       })
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
