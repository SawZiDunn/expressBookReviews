const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    for (const user of users) {
        if (user.username === username) {
            // cannot use forEach since it canno break the loop
            return true; // returns false and breaks the loop as soon as the condition is met
        }
    }
    return false;
};

const authenticatedUser = (username, password) => {
    for (const user of users) {
        if (user.username === username && user.password === password) {
            return true; // returns true and breaks the loop as soon as the condition is met
        }
    }
    return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(404)
            .json({ message: "Username or password is not provided!" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username }, "access", {
            expiresIn: 60 * 60,
        });
        req.session.authorization = { accessToken };
    } else {
        return res.status(403).json({ message: "The user is not registered!" });
    }
    return res.status(200).json({ message: "You are successfully logged in!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    // from query
    const { review } = req.query;
    // from request.user
    const { username } = req.user;
    books[isbn].reviews[username] = review;
    return res
        .status(300)
        .json({ message: "Review already added!", book: books[isbn] });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // from params
    const { isbn } = req.params;
    // from request.user
    const { username } = req.user;

    delete books[isbn].reviews[username];
    return res
        .status(300)
        .json({ message: "Review successfully deleted!", book: books[isbn] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
