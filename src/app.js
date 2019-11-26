/*******************************************************************
  IMPORTS
*******************************************************************/

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const imagesRouter = require('./images/images-router');
const submissionRouter = require('./submission/submission-router');
const knex = require('knex');
const validateBearerToken = require('./bin/validateBearerToken');
const errorHandler = require('./bin/errorHandler');

/*******************************************************************
  INIT
*******************************************************************/
const app = express();
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

/*******************************************************************
  MIDDLEWARE
*******************************************************************/
app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(cors());
app.use(helmet());
app.set('db', db);

/*******************************************************************
  ROUTES
*******************************************************************/
app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/index.html');
  // return res.status(200).end();
});

app.use('/api/submission', submissionRouter);
app.use('/api/images/', imagesRouter);

/*******************************************************************
  ERROR HANDLING
*******************************************************************/
// Catch-all 404 handler
app.use((req, res, next) => {
  const err = new Error('Path Not Found');
  err.status = 404;
  next(err); // goes to errorHandler
});
app.use(errorHandler);

/*******************************************************************
  EXPORTS
*******************************************************************/
module.exports = app;
