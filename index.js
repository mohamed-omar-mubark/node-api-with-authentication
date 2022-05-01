const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");
app.use(bodyParser.json());

// import routes
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");

// connect to db
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log("Connected to DB")
);

// middleware
app.use(express.json());
// route middlewares
app.use("/api/user", authRoute);
app.use("/api/products", productRoute);

app.listen(3000, () => console.log("Server up and running"));