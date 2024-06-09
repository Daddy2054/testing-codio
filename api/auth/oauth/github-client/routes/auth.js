import crypto from 'node:crypto';
import fetch, { FormData } from 'node-fetch';

import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => {
  // storing the state to check later. This is needed to protect from CSRF vulnerabilities.
  req.session.oauthState = crypto.randomBytes(64).toString('base64url');

  // we will be redirecting the user's browser to GitHub's authentication endpoint
  // GitHub should redirect back to redirectUri in both cases whether the user approved or not

  const uri = new URL(req.app.get('oauth').authEndpoint);
  const params = uri.searchParams;
  // The user can potentially see these parameters in the URL,
  // that's why there is no client secret here.
  // The client ID is used so that GitHub knows which application requests
  params.append('client_id', req.app.get('oauth').clientId);
  params.append('redirect_uri', req.app.get('oauth').redirectUri);
  params.append('state', req.session.oauthState);
  params.append('response_type', 'code');
  // if our app needs more than public information, our app has to request a scope.
  // See https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
  // for example the scope below will request access for the app to write to
  // the user's private repos and to the user's gists (gist.github.com)
  // params.append('scope', 'repo gist');

  res.redirect(302, uri);
});

router.get('/oauth-callback', async (req, res, next) => {
  // The state parameter that we got back from GitHub must match the one in the session.
  // Otherwise this might mean that the request to /oauth-callback was forged.
  // See for example https://security.stackexchange.com/a/57886
  if (req.query.state !== req.session.oauthState) {
    req.session.lastAuthError = 'The received OAuth state did not match the saved state';
    return res.redirect(302, '/');
  }
  req.session.oauthState = null;

  // GitHub sends an error here e.g. when the user has declined the request
  if (req.query.error) {
    console.log('Error from GitHub.', req.query.error, req.query.error_description, req.query.error_uri);
    req.session.lastAuthError = req.query.error_description;
    return res.redirect(302, '/');
  }

  // GitHub didn't pass the token to /oauth-callback
  // because the URL and the request can be seen by the user in the browser
  // it redirects with query parameters `code` and `state`.
  // We have checked `state` above.
  // Now we need to exchange the temporary `code` to an access token.
  const form = new FormData();
  form.append('client_id', req.app.get('oauth').clientId);
  form.append('client_secret', req.app.get('oauth').clientSecret);
  form.append('code', req.query.code);
  form.append('grant_type', 'authorization_code');
  form.append('redirect_uri', req.app.get('oauth').redirectUri);

  try {
    // Now we make a direct POST request to GitHub, without redirecting the user's browser,
    // that's why we can send client_secret here in the body of the request.
    const response = await fetch(req.app.get('oauth').tokenEndpoint, { method: 'POST', body: form });
    if (!response.ok) {
      req.session.lastAuthError = await response.text();
      return res.redirect(302, '/');
    }

    const responseForm = await response.formData();

    // Now we have got the access_token from github
    // that can be used to access GitHub API on behalf of the user.
    req.session.githubAccessToken = responseForm.get('access_token');
    req.session.lastAuthError = '';

    res.redirect(302, '/');
  } catch (err) {
    next(err);
  }
});

export default router;
