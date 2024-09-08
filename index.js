const express = require('express');
const app = express();
const logger = require('./middlewares/logger');
require('express-async-errors');

// we need to pass 'app' to startup/routes module(that is connected to port 3000)
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

// const p = Promise.reject(new Error("unhandled rejection."));
// p.then(()=>console.log('OK'));
 
// throw new Error('injecting uncaught exception');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, ()=>logger.info(`Listening at port ${PORT}.`));
module.exports = server;