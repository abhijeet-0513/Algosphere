const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");

app.use(express.json());
app.use(cookieParser());
app.use("/user", authRouter);

// first connect both the databases then start listening to the request

const InitializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`server is listening at port number: ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Error: " + err);
  }
};

InitializeConnection();
