import logger from "./logger.js";
import md5 from "md5";

const subscriptions = {
  subscription_base: {
    item_id: "subscription_base",
    title: "Подписка на все наборы слов",
    price: 10,
    period: 30,
    trial_duration: 0,
    photo_url:
      "https://st2.depositphotos.com/1064024/10769/i/600/depositphotos_107694484-stock-photo-little-boy.jpg",
  },
};

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
    const { notification_type, item } = body;
    console.log(body);
    switch (notification_type) {
      case "get_subscription_test":
      case "get_subscription":
        return subscriptions[item];
    }
    return {};
  },
};

export default vkAppHandler;
