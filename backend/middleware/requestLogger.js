const morgan = require('morgan');
const logger = require('../utils/logger');

const requestLogger = morgan(':method :url :status :response-time ms - :remote-addr', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

module.exports = requestLogger;
