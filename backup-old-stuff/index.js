import passport from 'passport';
import LocalStrategy from 'passport-local';
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const MongoStore = require('connect-mongo')(session);
import path from 'path';

import User from './server/models/user';
import index from './server/routes/index';
import leonie from './server/routes/leonie';

const PORT = 8445;
const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1/leonie';

const app = express();
const sessionOptions = {
  secret: 'Dimi loves Leo',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: mongoUrl })
};

// setup
app.set('port', PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'server/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// routes
app.use('/leonie', leonie);
app.use('/*', index);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
));

// startup
mongoose.connect(mongoUrl, (err, database) => {
  if (err) throw err;

  app.listen(app.get('port'));

  console.log('Listening op port ' + app.get('port'));
});


// http://blog.robertonodi.me/node-authentication-series-email-and-password/
