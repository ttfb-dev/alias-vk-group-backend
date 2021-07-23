import logger from "./logger.js";
import md5 from "md5";

const vkAppHandler = {
  checkCred: (body) => {
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

    return sig === md5(orderedString);
  },

  processRequest: async (body) => {
    logger.debug("got app callback request", {
      body,
    });
    return "ok";
  },
};

export default vkAppHandler;
