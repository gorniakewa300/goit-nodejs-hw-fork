const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const dbName = "db-contacts";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection successful");
    console.log(
      "You are logged in database:",
      await mongoose.connection.db.databaseName
    );
  } catch (e) {
    console.error("Database connection error:", e);
    process.exit(1);
  }
};

dbConnect();

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
