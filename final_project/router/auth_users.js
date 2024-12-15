const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  name: "Ricardo",
  password: "skypsnet"
}];

const isValid = (username)=>{ //returns boolean
    return users.find((e)=> e.name === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.find((e)=> e.name === username && e.password ===password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {name, password} = req.body;

  if(!name || !password){
    return res.status(400).send("Error logging in");
  }

  if(authenticatedUser(name,password)){
        let accessToken = jwt.sign({data:name},"access",{expiresIn: 60 * 60});
        
        req.session.authorization = {
          accessToken, name
        }
        return res.status(200).send("User "+name+" has been logged in");

  }else{
        return res.status(400).send("Error logging in");
  }

});

regd_users.post("/register", (req,res)=>{
   const {name, password} = req.body;

   if(!isValid(name)){
      users.push({
        name: name,
        password: password
      });

      res.send("The user with name: "+name+" has been registered");
   }else{
      res.status(400).send("The username is duplicate")
   }

})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const name = req.user.data
  const isbn = req.params.isbn;
  const review = req.body.review;
  if(books[isbn]){
      books[isbn].reviews[name] = review;
      return res.status(200).json({message: "The review has been submited"});
  }else{
    return res.status(400).send("ISBN not found")
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req,res)=>{
  
  const name = req.user.data;
  const isbn = req.params.isbn;

  if(books[isbn]){
    delete books[isbn].reviews[name]
    return res.status(200).json({message: "The review has been eliminated"});
  }else{
    return res.status(400).send("ISBN not found")
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
