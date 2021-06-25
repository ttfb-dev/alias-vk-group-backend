import logger from "./logger.js";
import prs from "./prs.js";

const vkGroupHandler = {
  checkCred: (group, secret) => {
    return group === parseInt(process.env.GROUP_ID) && secret === process.env.GROUP_SECRET;
  },

  processRequest: async (body) => {
    if (!body.hasOwnProperty('type')) {
      logger.critical('got untyped request', {handler: 'vkGroupHandler.processRequest', body})
      return 'ok';
    }
    const { type, object } = body;
    switch (type) {
      case 'confirmation':
        return 'b68706e2';
      case 'group_leave':
        await prs.setUserParam(object.user_id, 'is_group_member', false)
      case 'group_join':
        await prs.setUserParam(object.user_id, 'is_group_member', true);
      case 'donut_subscription_create':
        await prs.setUserParam(object.user_id, 'is_donut', true);
        await prs.setUserParam(object.user_id, 'donut_value', object.amount);
      case 'donut_subscription_expired':
        await prs.setUserParam(object.user_id, 'is_donut', false);
        await prs.delUserParam(object.user_id, 'donut_value');
      default:
        await logger.debug('got unused type', body);
    }
    return 'ok';
  }
}

export default vkGroupHandler;