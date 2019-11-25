/*******************************************************************
  IMPORTS
*******************************************************************/
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
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
})

/*******************************************************************
  MIDDLEWARE
*******************************************************************/
app.use(morgan(NODE_ENV === 'production' ? 'tiny' : 'common'));
app.use(cors());
app.use(helmet());
app.set('db', db)
// app.use(express.json());
// app.use(validateBearerToken);

/*******************************************************************
  ROUTES
*******************************************************************/
app.get('/', (req, res) => {
  return res.status(200).send('Running...');
});

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
