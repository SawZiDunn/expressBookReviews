const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

// tells your express app to use session middleware
app.use(
    "/customer",
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    // if the user is already authorized
    if (req.session.authorization) {
        const token = req.session.authorization["accessToken"]; // .accessToken
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                res.status(403).json({ msg: "User is not authenticated!" });
            } else {
                req.user = user;
                // pass to the next route
                next();
            }
        });
    } else {
        res.status(403).json({ msg: "User is not logged in." });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
