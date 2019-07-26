import dotenv from 'dotenv';
import OAuth2Strategy from 'passport-oauth2';

const result = dotenv.config({ silent: process.env.NODE_ENV === 'production' });
if (result.error) {
  throw result.error;
}

class PassportSeedAccounts extends OAuth2Strategy {
  userProfile(accessToken, done) {
    // eslint-disable-next-line no-underscore-dangle
    this._oauth2._request('GET', `${process.env.HYDRA_PUBLIC_URL}/userinfo`, null, null, accessToken, (err, body) => {
      if (err) {
        return done(err, null);
      }
      let data = null;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return done(e, null);
      }
      return done(null, data);
    });
  }

  setCredentials(clientId, clientSecret, callbackUrl, scope) {
    // eslint-disable-next-line no-underscore-dangle
    this._oauth2._clientId = clientId;
    // eslint-disable-next-line no-underscore-dangle
    this._oauth2._clientSecret = clientSecret;
    // eslint-disable-next-line no-underscore-dangle
    this._callbackURL = callbackUrl;
    // eslint-disable-next-line no-underscore-dangle
    this._scope = scope;
  }
}

const client = new PassportSeedAccounts({
  authorizationURL: `${process.env.HYDRA_PUBLIC_URL}/oauth2/auth`,
  tokenURL: `${process.env.HYDRA_PUBLIC_URL}/oauth2/token`,
  clientID: 'clientIDHere',
  clientSecret: 'clientSecretHere',
  callbackURL: 'callbackURLHere',
  scope: [],
  state: true,
},
(accessToken, refreshToken, params, profile, done) => {
  if (process.env.DEBUG) {
    console.log('params', params);
    console.log('accessToken: ', accessToken);
    console.log('profile: ', profile);
  }
  done(null, profile);
});

module.exports = client;
