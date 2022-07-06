// Imports

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import * as dotenv from "dotenv";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./graphql/schema";
import { graphqlResolver } from "./graphql/resolvers";
import imguploadLoader from "./routes/imgloader";
import passport from "passport";
import { Jwt } from "jsonwebtoken";

import { awsUpload } from "./middlewares/multer";
console.log("graphqlResolver", graphqlResolver);
// End of imports

const app = express();
dotenv.config();

// Connect to mongoose
// Problems to solve: type is any, dotenv is not a string? what type is it?
const mongooseLogin: any = process.env.MONGO_URI;
const jwtAuth = passport.authenticate("jwt", { session: false });

const DataBaseConnect = async () => {
  try {
    await mongoose.connect(mongooseLogin);
    console.log("Connection established with mongo");
  } catch (error) {
    console.log("DB error", error);
  }
};
// End of connect to mongoose

//Post image with REST

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/img-upload", imguploadLoader);
//end of post image with REST

// Cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
// End of Cors

// Express
app.use(bodyParser.json());

app.listen(8080);
//End of Express

//GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "an error occured";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

// end of GraphQL

DataBaseConnect();
