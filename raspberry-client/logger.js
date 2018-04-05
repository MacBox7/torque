const winston = require('winston');
const config = require("./config.js");

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
        level: config.log.level
      })
    ]
  });

module.exports = logger;

/*--------Logger Usage---------
logger.debug('Debugging info');
logger.verbose('Verbose info');
logger.info('Logging info');
logger.warn('Warning message');
logger.error('Error info');
------------------------------*/