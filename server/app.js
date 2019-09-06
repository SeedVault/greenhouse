let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let helmet = require('helmet');
var db = require('../domain/services/database');
let csrf = require('csurf');
let passport = require('passport');
let session = require('express-session');
let redisStoreProto = require('connect-redis');
let api = require('./controllers/api');
let components = require('./controllers/components');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    // cb(null, `${req.params.id}.jpg`);
    const timestamp = new Date().getTime().toString();
    cb(null, `${timestamp}.jpg`);
  }
})
const imageFilter = function (req, file, cb) {
  if (file.mimetype !== 'image/jpeg') {
    return cb(new Error('Only JPG image files are allowed'), false);
  }
  cb(null, true);
}
var upload = multer({ storage: storage, fileFilter: imageFilter });

// Allow self-signed certs in development
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Available locales
const availableLocales = ['en', 'es'];
// const locale = ':locale(' + availableLocales.join('|') + ')';
module.exports = function(app) {

  const RedisStore = redisStoreProto(session);
  // const { ensureLoggedIn } = require('connect-ensure-login');
  // const cors = require('cors');
  const client = require('passport-seed-accounts/lib');

  client.setCredentials(
    process.env.GREENHOUSE_OAUTH2_CLIENT_ID,
    process.env.GREENHOUSE_OAUTH2_CLIENT_SECRET,
    process.env.GREENHOUSE_OAUTH2_CALLBACK_URL,
    ['offline', 'openid'],
  );
  passport.use(client);

  passport.serializeUser((user, done) => {
    const loadedUser = {
      id: user.sub,
      email: user.email,
      username: user.username,
      picture: user.picture
    };
    done(null, JSON.stringify(loadedUser));
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

  // Connect to database
  db();


  // Middleware
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());


  // Set up protection against CSRF
  /* var csrfCheck = csrf({ cookie: true, secure: true });
  app.use(csrfCheck);
  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    // var validationError = createValidationError('Invalid CSRF token');
    // return res.status(422).json(validationError);
    return res.status(422).json({"errors":{"_":{"message":"validation.csrf_token"}}});
  }); */

  // Detect language
  app.use((req, res, next) => {
    let lang = req.cookies.lang;
    if (!lang) {
      let acceptsLanguages = req.acceptsLanguages();
      for (let i = 0; i < acceptsLanguages.length; i++) {
        let langParts = acceptsLanguages[i].split('-');
        if (availableLocales.includes(langParts[0])) {
          lang = langParts[0];
          break;
        }
      }
    }
    if (!lang) lang = availableLocales[0];
    req.lang = lang;
    // res.cookie('lang', String(lang), {secure: true});
    next();
  });




  // Routes
  app.get('/', (req, res) => res.redirect(`/${req.lang}/home`));
  app.get('/auth/legal/tos', (req, res) => res.redirect(`/${req.lang}/legal/tos`));
  app.get('/auth/legal/policy', (req, res) => res.redirect(`/${req.lang}/legal/policy`));

  // This endpoint initializes the OAuth2 request
  app.get('/auth/login', passport.authenticate('oauth2', {
    session: true,
    successReturnToOrRedirect: '/',
    failureRedirect: '/',
  }));

  app.get('/auth/logout', (req, res) => {
    req.logout();
    req.session.destroy(() => res.redirect('/'));
  });

  // This endpoint handles OAuth2 requests (exchanges code for token)
  app.get('/auth/callback',
    passport.authenticate('oauth2', { failureRedirect: '/' }),
    (req, res, next) => {
      if (!req.user) {
        throw new Error('user null');
      }
      // After success, redirect to the page we came from originally
      // res.redirect(req.session.redirectTo);
      res.redirect(`/${req.lang}/dashboard`);
    });

  app.get('/auth/me', (req, res) => {
    if (!req.user) {
      res.status(403).json('Forbidden');
    }
    res.status(200).json(req.user);
  });

  // App routes
  app.get('/api/dashboard', api.getDashboard);
  // Components
  app.get('/api/components', components.list);
  app.post('/api/components/save', components.save);
  app.post('/api/components/delete', components.delete);
  app.post('/api/components/:id/change-picture', upload.single('pictureFile'), components.changePicture);
  app.get('/api/components/:id', components.view);
}
