import logger from "./logger.js";
import md5 from "md5";

const vkAppHandler = {
  checkCred: async (body) => {
    let orderedString = "";
    let sig = "";
    Object.keys(body)
      .sort()
      .forEach((key) => {
        if (key === "sig") {
          sig = body[key];
          return;
        }
        orderedString += `${key}=${body[key]}`;
      });

    orderedString += process.env.APP_SECRET;

    await logger.debug("got app callback request", {
      sig: sig,
      calcMd5: md5(orderedString),
      string: orderedString,
    });

    return false;
  },

  processRequest: async (body) => {
    logger.debug("got app callback request", {
      body,
    });
    return "ok";
  },
};

export default vkAppHandler;
