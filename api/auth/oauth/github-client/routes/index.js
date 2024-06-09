import fetch from 'node-fetch';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (req.session.githubAccessToken) {
      // we have an access token stored from the log in
      // do an authorized request to the GitHub API with the token on behalf of the user
      const userResponse = await fetch(req.app.get('githubUserEndpoint'), {
        headers: {
          Authorization: `Bearer ${req.session.githubAccessToken}`,
        },
      });
      if (userResponse.ok) {
        const userJson = await userResponse.json();
        // the user json contains links to other API endpoints related to this user
        return res.status(200).send(`GitHub returned for the current user: <pre>${JSON.stringify(userJson, null, 2)}</pre>`);
      } if (userResponse.status === 401) {
        // if GitHub responded with 401 Unauthorized, the token is no longer valid
        req.session.githubAccessToken = null;
      } else {
        const errorText = await userResponse.text();
        return res.status(200).send(errorText);
      }
    }
    // if there is no access token or the stored one is no longer valid, let's log in again.
    // The <a> link is to /login, see the  endpoint handler in auth.js
    const errorPrefix = !req.session.lastAuthError ? '' : `There was an error: ${req.session.lastAuthError}<br/>`;
    res.status(200).send(`${errorPrefix}<a href="/login">Log in using GitHub</a>`);
  } catch (err) {
    next(err);
  }
});

export default router;
