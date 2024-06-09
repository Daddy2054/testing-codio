import createError from 'http-errors';
import Sqlite from 'better-sqlite3';
import * as jose from 'jose';
import fetch from 'node-fetch';
import express from 'express';
import expressSession from 'express-session';
import sqliteSessionStore from 'better-sqlite3-session-store';

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';

const port = 3000;

const db = new Sqlite('app.db');

const app = express();
const SqliteSessionStore = sqliteSessionStore(expressSession);

app.set('openid', {
  // The client ID from the settings of an OAuth 2.0 Client in Google Cloud Console
  clientId: '',
  // The client secret from the settings of an OAuth 2.0 Client in Google Cloud Console
  clientSecret: '',
  // must be the same as the one in the settings of an OAuth 2.0 Client in Google Cloud Console
  redirectUri: 'https://trapezejerome-vitalconvert-3000.codio.io/oauth-callback',
  discoveryUri: 'https://accounts.google.com/.well-known/openid-configuration',
});

app.use(express.json());
app.use(expressSession({
  store: new SqliteSessionStore({
    client: db,
  }),
  resave: false,
  saveUninitialized: false,
  secret: 'vital-convert',
}));

app.use(indexRouter);
app.use(authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.message);
});

async function start() {
  // This loads the metadata about the OpenID Connect service: the authorization authEndpoint,
  // the token endpoint, the revocation endpoint, the issuer, 
  // the URI of JWKS which is used to verify tokens created by Google.
  // You can see in more details in the specification of OpenID Connect Discovery:
  // https://openid.net/specs/openid-connect-discovery-1_0.html
  const response = await fetch(app.get('openid').discoveryUri);
  if (!response.ok) {
    throw new Error('OpenID Discovery failed');
  }
  const discoveryConfig = await response.json();
  console.log(discoveryConfig);

  app.get('openid').discoveryConfig = discoveryConfig;
  app.get('openid').jwks = jose.createRemoteJWKSet(new URL(discoveryConfig.jwks_uri));

  app.listen(port);
}

start();
