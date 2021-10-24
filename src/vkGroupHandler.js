import logger from "./logger.js";
import prs from "./prs.js";
import fetch from "node-fetch";

const vkGroupHandler = {
  checkCred: (group, secret) => {
    return (
      group === parseInt(process.env.GROUP_ID) &&
      secret === process.env.GROUP_SECRET
    );
  },

  processRequest: async (body) => {
    if (!body.hasOwnProperty("type")) {
      logger.critical("got untyped request", {
        handler: "vkGroupHandler.processRequest",
        body,
      });
      return "ok";
    }
    const { type, object } = body;
    console.log(body);
    let needRefreshDatasets = false;
    switch (type) {
      case "confirmation":
        return "688064d5";
      case "group_leave":
        await prs.setUserParam(object.user_id, "is_group_member", false);
        needRefreshDatasets = true;
        break;
      case "group_join":
        await prs.setUserParam(object.user_id, "is_group_member", true);
        needRefreshDatasets = true;
        break;
      case "donut_subscription_create":
        await prs.setUserParam(object.user_id, "is_donut", true);
        await prs.setUserParam(object.user_id, "donut_value", object.amount);
        needRefreshDatasets = true;
        break;
      case "donut_subscription_expired":
        await prs.setUserParam(object.user_id, "is_donut", false);
        await prs.delUserParam(object.user_id, "donut_value");
        needRefreshDatasets = true;
        break;
      case "wall_repost": 
        await logger.debug("got repost", body);
        break;
      default:
        await logger.debug("got unused type", body);
        break;
    }
    if (needRefreshDatasets) {
      try {
        await fetch(
          `http://logux-proxy:80/user/${object.user_id}/refresh-datasets`
        );
      } catch ({ message }) {
        logger.critical(message, {
          method: "vkGroupHandler.processRequest",
          body,
        });
      }
    }
    return "ok";
  },
};

export default vkGroupHandler;
