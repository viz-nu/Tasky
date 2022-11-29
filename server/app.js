import express from "express";
import config from "config";
import path from 'path';

import "./dbconnect.js";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);
const app = express();
const port = config.get("PORT");
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


import userRouter from "./controllers/users/index.js";
import taskRouter from "./controllers/tasks/index.js";

app.use(express.json());

app.use("/api/user/", userRouter);
app.use("/api/task/", taskRouter);

app.listen(port, () => {
    console.log(`server started at ${port}`);
});

