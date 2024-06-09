import createError from 'http-errors';
import express from 'express';
import Sqlite from 'better-sqlite3';
import expressSession from 'express-session';

import sqliteSessionStore from 'better-sqlite3-session-store';

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';

const port = 3000;

const app = express();

const db = new Sqlite('app.db');
const SqliteSessionStore = sqliteSessionStore(expressSession);

app.set('oauth', {
  // The client ID from the settings of an app in GitHub
  clientId: '',
  // The client secret from the settings of an app in GitHub
  clientSecret: '',
  // must be the same as the one in the settings of an app in GitHub
  redirectUri: 'https://chemistcommand-italianwatch-3000.codio.io/oauth-callback',
  authEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
});
app.set('githubUserEndpoint', 'https://api.github.com/user');

app.use(express.json());

app.use(expressSession({
  store: new SqliteSessionStore({
    client: db,
    expired: {
      clear: true,
      intervalMs: 5 * 60 * 1000, // 5 minutes
    },
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

app.listen(port);

// The Client Secret is only passed in the form, not as part of the search parameters which can be seen in the URL.

// The oauth-callback endpoint checks the oauthState to make sure the sessions match. This value is created by encoding random numbers.