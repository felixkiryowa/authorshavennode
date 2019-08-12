import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import  bodyParser  from 'body-parser';
import users from './server/routes/api/users';
const port = 3000;

require("dotenv").config()

// Set up the express app
const app = express();
app.listen(process.env.PORT ||  port, () => console.log(`Example app listening on port ${port}!`));

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the application.
require('./server/routes')(app);
// Create a passport middleware
app.use(passport.initialize());
// Passport Config 
require('./config/passport')(passport);
//  Use routes 
app.use('/api/users', users);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

export default app;
