import { Logger } from '@ttfb/aliasgame';
const host = process.env.LOGGER_HOST;
const logger = new Logger(host, 'vk-group-backend');

export default logger;
