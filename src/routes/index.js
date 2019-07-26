import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';

const result = dotenv.config({ silent: process.env.NODE_ENV === 'production' });
if (result.error) {
  throw result.error;
}

const router = express.Router();

// End of Passport.js configuration

// This is a middleware that checks if the user is authenticated.
// It also remembers the URL so it can be used to redirect to it after the
//  user authenticated.
/* const checkAuthentication = (req, res, next) => {
  // The `isAuthenticated` is available because of Passport.js
  if (!req.isAuthenticated()) {
    req.session.redirectTo = req.url;
    res.redirect('/auth');
    return;
  }
  next();
}; */


/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// This endpoint initializes the OAuth2 request
router.get('/login', passport.authenticate('oauth2'));

// This endpoint handles OAuth2 requests (exchanges code for token)
router.get('/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  (req, res, next) => {
    if (!req.user) {
      throw new Error('user null');
    }
    console.info(req.user);
    // After success, redirect to the page we came from originally
    // res.redirect(req.session.redirectTo);
    res.redirect('/');
  });

export default router;
