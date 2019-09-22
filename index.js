import express from 'express';
import error from './server/middlewares/error.middleware';
import notfound from './server/middlewares/404.middleware';
import winston from 'winston';
import logger from 'morgan';
import passport from 'passport';
import  bodyParser  from 'body-parser';
import cors from 'cors';
import env from 'dotenv';
import users from './server/routes/api/users';
var session = require('express-session');
const port = 8080;

env.config();

// Set up the express app
const app = express();
app.listen(process.env.PORT ||  port, () => winston.info(`Example app listening on port ${port}!`));

// Log requests to the console.
app.use(logger('dev'));

// add cors
app.use(cors());

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the application.
require('./server/routes')(app);
// Create a passport middleware
app.use(passport.initialize());
app.use(session({
  secret: 'SECRET',
  resave: true,
  saveUninitialized: true
}));
// Passport Config 
// require('./config/passport')(passport);
//  Use routes 
app.use('/api/users', users);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

app.use(notfound);
app.use(error);

export default app;
