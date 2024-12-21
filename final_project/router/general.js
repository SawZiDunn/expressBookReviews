const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(404)
            .json({ message: "Username or password is not provided" });
    }

    if (isValid(username)) {
        return res
            .status(404)
            .json({ message: "Username is already registered!" });
    }

    newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    return res
        .status(300)
        .json({ message: "A new user is already registered!", user: newUser });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    // console.log(books);
    return res.status(200).json({
        message: "Books",
        books,
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const { isbn } = req.params;
    return res.status(200).json({ book: books[isbn] });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;

    // let filteredBooks = {};
    // Object.keys(books).forEach((key) => {
    //     if (books[key]["author"] === author) {
    //         filteredBooks[key] = books[key];
    //     }
    // });

    // get key-value pairs in an array using Object.entries()
    // filter according to the matched author, array destructuring is used
    // reduce() accepts a callback and initial value for result
    let filteredBooks = Object.entries(books)
        .filter(([key, value]) => value.author === author)
        .reduce((result, [key, value]) => {
            result[key] = value;
            return result; // return in the end, not for every loop
        }, {});

    if (Object.keys(filteredBooks).length === 0) {
        return res.status(404).json({
            message: `No books found with the title: "${title}"`,
        });
    }

    return res.status(200).json({ filteredBooks });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    console.log(title);

    let filteredBooks = Object.entries(books)
        .filter(([k, v]) => v.title === title)
        .reduce((result, [key, value]) => {
            result[key] = value;
            return result;
        }, {});
    return res.status(300).json({ filteredBooks });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    return res
        .status(300)
        .json({ bookName: book.title, reviews: book.reviews });
});

module.exports.general = public_users;
