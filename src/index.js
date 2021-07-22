import express from "express";
import bodyParser from "body-parser";
import logger from "./logger.js";
import vkGroupHandler from "./vkGroupHandler.js";

const app = express();
const port = 80;
app.use(bodyParser.json());

app.post("/callback-group", async (req, res) => {
  const body = req.body;
  try {
    if (vkGroupHandler.checkCred(body.group_id, body.secret)) {
      const responseText = await vkGroupHandler.processRequest(body);
      res.status(200).send(responseText ?? "ok");
      return;
    }
    throw new Error("Wrong credentials");
  } catch ({ message }) {
    logger.critical(message, { body });
  }
  res.status(200).send();
});

app.post("/callback-app", async (req, res) => {
  const body = req.body;
  try {
    if (await vkAppHandler.checkCred(body.group_id, body.secret)) {
      const responseText = await vkAppHandler.processRequest(body);
      res.status(200).send(responseText ?? "ok");
      return;
    }
    throw new Error("Wrong credentials");
  } catch ({ message }) {
    logger.critical(message, { body });
  }
  res.status(200).send();
});

app.get("/", async (req, res) => {
  res.status(200).send();
});

app.listen(port);
