import dotenv from 'dotenv';
import createError from 'http-errors';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import redisStoreProto from 'connect-redis';

// import indexRouter from './routes/index';

const result = dotenv.config({ silent: process.env.NODE_ENV === 'production' });
if (result.error) {
  throw result.error;
}

const RedisStore = redisStoreProto(session);

const { ensureLoggedIn } = require('connect-ensure-login');

const cors = require('cors');

const client = require('./services/passport-seed-accounts');

client.setCredentials(
  process.env.GREENHOUSE_OAUTH2_CLIENT_ID,
  process.env.GREENHOUSE_OAUTH2_CLIENT_SECRET,
  process.env.GREENHOUSE_OAUTH2_CALLBACK_URL,
  ['offline', 'openid'],
);

const app = express();

passport.use(client);

passport.serializeUser((user, done) => {
  console.warn('------------------------');
  const loadedUser = {
    email: user.sub,
  };
  done(null, JSON.stringify(loadedUser));
  console.warn(JSON.stringify(loadedUser));
  console.warn('------------------------');
});


passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user));
});

// These are middlewares required by passport js
app.use(session(
  {
    secret: process.env.ACCOUNTS_SESSION_SECRET,
    store: new RedisStore({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      pass: process.env.REDIS_PASSWORD,
      // ttl: 260,
    }),
    resave: false,
    saveUninitialized: true,
  },
));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Middleware
app.use(cors());
app.use(compression());
app.use(helmet());

// Static folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes
// app.use('/', indexRouter);
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Public
app.get('/public', (req, res) => {
  res.render('public', { title: 'Home' });
});

// Members only
app.get('/members', ensureLoggedIn('/login'), (req, res) => {
  res.render('members', { title: 'Home' });
});

// Another private page
app.get('/private', ensureLoggedIn('/login'), (req, res) => {
  res.render('private', { title: 'Home' });
});

// This endpoint initializes the OAuth2 request
app.get('/login', passport.authenticate('oauth2', {
  session: true,
  successReturnToOrRedirect: '/',
  failureRedirect: '/',
}));

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// This endpoint handles OAuth2 requests (exchanges code for token)
app.get('/callback',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  (req, res, next) => {
    if (!req.user) {
      throw new Error('user null');
    }
    console.info(req.user);
    // After success, redirect to the page we came from originally
    // res.redirect(req.session.redirectTo);
    res.redirect('/');
  });

// error handling
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Oops!' });
});

export default app;
