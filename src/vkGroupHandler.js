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
      case 'group_join':
        prs.setUserParam(object.user_id, 'group_join_status', type);
      default:
        await logger.debug('got new type', body);
    }
    return 'ok';
  }
}

export default vkGroupHandler;