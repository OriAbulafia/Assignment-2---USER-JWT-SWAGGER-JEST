import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import post_routes from "./routes/post_routes.js";
import comment_routes from "./routes/comment_routes.js";
import user_routes from "./routes/user_routes.js";

const app = express();
const port = process.env.PORT;
if (process.env.DB_CONNECT === undefined) {
  console.error("DB_CONNECT is not defined");
  Promise.reject();
} else {
  mongoose.connect(process.env.DB_CONNECT);
}
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/post", post_routes);
app.use("/comment", comment_routes);
app.use("/user", user_routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
