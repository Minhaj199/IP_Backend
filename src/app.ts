import express from "express";
import cors from "cors";
import { router } from "./routes/router";
import morgan from "morgan";
import { dbConnection, idSequenceCreation } from "./config/mongoDB";
import { server } from "./config/server";
import { pageNotFount } from "./middleware/404";
import { erroHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

export const app = express();

const corsOpetion = {
  origin: [env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  exposedHeaders: ["authorizationforuser"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion));

///loger///
app.use(morgan("tiny"));

/// routes//////
app.get('/',(req,res)=>{
  res.send('entered to server')
})
app.use("/api", router);

////////////404 route/////
app.use(pageNotFount);
///////////// server//////
server();

////////creation and checking of id sequence////

idSequenceCreation();

///////////// db connection
dbConnection();

/////////////error handler//////////////////
app.use(erroHandler);
