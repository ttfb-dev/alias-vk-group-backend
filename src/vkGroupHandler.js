import logger from "./logger.js";

const vkGroupHandler = {
  checkCred: (group, secret) => {
    return group === parseInt(process.env.GROUP_ID) && secret === process.env.GROUP_SECRET;
  },

  processRequest: async (body) => {
    if (!body.hasOwnProperty('type')) {
      logger.debug('got untyped request', {handler: 'vkGroupHandler.processRequest', body})
      return ;
    }
    const {type} = body;
    switch (type) {
      case 'confirmation':
        return 'b68706e2';
      default:
        await logger.debug('got new type', body);
    }
  }
}

export default vkGroupHandler;