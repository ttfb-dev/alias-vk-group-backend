import logger from "./logger.js";
import prs from "./prs.js";
import fetch from "node-fetch";
import { Event, eventBus, EVENTS } from "./events.js";

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
    let needRefreshDatasets = false;
    switch (type) {
      case "confirmation":
        return "5eee8dea";
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
      case "board_post_new":
        if (object.topic_id === 48193061) {
          const event = new Event(EVENTS.USER_POST_REVIEW_HALLOWEEN_2021);
          eventBus.newEvent(event, { userId: object.from_id });
        }
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
