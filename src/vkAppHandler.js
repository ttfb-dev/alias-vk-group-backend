import logger from "./logger.js";
import md5 from "md5";

const vkAppHandler = {
  checkCred: async (body) => {
    const orderedString = {};
    Object.keys(body)
      .sort()
      .forEach((key) => {
        orderedString += `${key}=${body[key]}`;
      });

    orderedString += process.env.GROUP_SECRET;

    logger.debug("got app callback request", {
      string: orderedString,
      calcMd5: md5(orderedString),
      body,
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
