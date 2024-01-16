// Todo: Setup database connection here
import { MongoClient } from "mongodb";
const MongoDB_URL =
  "mongodb+srv://devrleang:4321@cluster0.6hdh41z.mongodb.net/";

const connectionString = MongoDB_URL;

export const dbClient = new MongoClient(connectionString, {});

export const db = dbClient.db("practice-mongo");
