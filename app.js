'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models/index');
const router = require('./routes/index');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use('/', router);

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'blogApp.db'
// });

sequelize.authenticate()
  .then(() => {
    console.log('Connection to database successful!')
  }).catch((err) => {
    console.error('Connection to database unsuccessful!', err);
  });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
