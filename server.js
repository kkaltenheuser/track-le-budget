// set dependencies
const express = require("express");
const compression = require("compression");
const path = require("path")
const logger = require("morgan");
const mongoose = require("mongoose");


// set PORT
const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
//
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
    useNewUrlParser: true,
    useFindAndModify: false
  }
);

// set routes
app.use(require("./routes/api.js"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});