import express from "express";
import cors from "cors";
import questionRouter from "./apps/questions.js";
import { dbClient } from "./utils/db.js";
import { MongoError } from "mongodb";

const init = async () => {
  try {
    const app = express();
    const port = 4008;
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    //connect Database
    await dbClient.connect();
    console.log(dbClient);
    app.use(cors());
    //use questionRouter
    app.use("/questions", questionRouter);

    app.get("/", (req, res) => {
      return res.json("Hello Skill Checkpoint #2");
    });

    app.get("*", (req, res) => {
      return res.status(404).json("Root Not found");
    });

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    if (error instanceof MongoError) {
      console.error("เกิดข้อผิดพลาดของ MongoDB:", error.message);
    } else {
      console.error("Error Message:", error.message);
    }
  }
};

init();
