import crypto from 'node:crypto';
import fetch, { FormData } from 'node-fetch';
import * as jose from 'jose';

import express from 'express';

import { sha256Digest } from './common.js';

const router = express.Router();

router.get('/login', (req, res) => {
  req.session.oauth = {
    // state is a random string that will be checked to protect from Cross-Site Request Forgery attacks, also known as CSRF or XSRF.
    state: crypto.randomBytes(64).toString('base64url'),
    // nonce is a random string that will be checked to protect from replay attacks by ensuring it is presented only once.
    // It is specified by the OpenID Connect Core specification, https://openid.net/specs/openid-connect-core-1_0.html
    nonce: crypto.randomBytes(64).toString('base64url'),
    // Code verifier is defined by the PKCE specification (Proof Key for Code Exchange). It protects from authorization code interception attacks.
    // In this attack, the attacker intercepts the authorization code returned from the authorization endpoint within a communication path
    // not protected by Transport Layer Security (TLS), such as inter-application communication within the client's operating system.
    // https://www.rfc-editor.org/rfc/rfc7636
    codeVerifier: crypto.randomBytes(64).toString('base64url'),
  };

  const openidConfig = req.app.get('openid');

  const uri = new URL(openidConfig.discoveryConfig.authorization_endpoint);
  const params = uri.searchParams;
  // The offline access is needed to request the refresh token.
  params.append('access_type', 'offline');
  params.append('client_id', openidConfig.clientId);
  params.append('redirect_uri', openidConfig.redirectUri);
  params.append('state', req.session.oauth.state);
  params.append('response_type', 'code');
  // openid scope is required to get an ID token,
  // profile scope requests the user's basic information such as name,
  // email scope request the user's email.
  params.append('scope', 'openid profile email');
  // The nonce will be returned as a part of an ID token
  params.append('nonce', req.session.oauth.nonce);
  // This creates a code challenge based on the code verifier. It is hased and not sent publicly to the browser.
  params.append('code_challenge', sha256Digest(req.session.oauth.codeVerifier).toString('base64url'));
  // This says which algorithm was used to create a challenge.
  params.append('code_challenge_method', 'S256');
  // TODO:
  // params.append('prompt', 'consent');
  // params.append('login_hint', req.session.tokens.id.email);

  res.redirect(302, uri);
});

router.get('/oauth-callback', async (req, res, next) => {
  try {
    // The auth server returns the token that protects from CSRF as is, this checks it.
    if (req.query.state !== req.session.oauth.state) {
      req.session.lastAuthError = 'The received OAuth state did not match the saved state';
      req.session.oauth = null;
      return res.redirect(302, '/');
    }

    if (req.query.error) {
      console.log('Error from the OpenID provider.', req.query.error, req.query.error_description, req.query.error_uri);
      req.session.lastAuthError = req.query.error_description;
      req.session.oauth = null;
      return res.redirect(302, '/');
    }

    const openidConfig = req.app.get('openid');

    const form = new FormData();
    form.append('client_id', openidConfig.clientId);
    form.append('client_secret', openidConfig.clientSecret);
    form.append('code', req.query.code);
    // The code verifier is sent to the auth server to check if it was the same as in the code challenge.
    // Now it is sent to the auth server directly, not via the client (the user's browser).
    form.append('code_verifier', req.session.oauth.codeVerifier);
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', openidConfig.redirectUri);

    const response = await fetch(openidConfig.discoveryConfig.token_endpoint, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      req.session.lastAuthError = await response.text();
      req.session.oauth = null;
      return res.redirect(302, '/');
    }

    const responseJson = await response.json();

    // The ID token has a JWT format.
    // This library function checks multiple things at once:
    // 1. First it checks that the ID token was signed by the private key of the issuer, e.g. Google.
    // This verification is done using the issuer's public key. The spec is at https://www.rfc-editor.org/rfc/rfc7517 
    // 2. It checks that the issuer of this ID token is same as we expect it to.
    // 3. It checks that the token was issued for the correct OAuth client ID, i.e. this application.
    const idVerifyResult = await jose.jwtVerify(responseJson.id_token, openidConfig.jwks, {
      issuer: openidConfig.discoveryConfig.issuer,
      audience: openidConfig.clientId,
    });
    const idTokenPayload = idVerifyResult.payload;
    // This checks the nonce token that was sent to the user's browser and now was returned by the auth server.
    if (idTokenPayload.nonce !== req.session.oauth.nonce) {
      req.session.lastAuthError = 'The received OAuth nonce did not match the saved nonce';
      return res.redirect(302, '/');
    }

    req.session.tokens = {
      access: responseJson.access_token,
      refresh: responseJson.refresh_token,
      // This payload of the ID token contains among others the data about the user and when the token expires.
      id: idTokenPayload,
    };
    console.log(idTokenPayload);

    req.session.lastAuthError = '';

    res.redirect(302, '/');
  } catch (err) {
    next(err);
  }
});

router.get('/logout', async (req, res, next) => {
  try {
    if (req.session.tokens && req.session.tokens.refresh) {
      const openidConfig = req.app.get('openid');

      const form = new FormData();
      form.append('token', req.session.tokens.refresh);
      form.append('token_type_hint', 'refresh_token');

      // This will invalidate the refresh token if there was one. The token won't be usable after this.
      // The spec is at https://www.rfc-editor.org/rfc/rfc7009
      const response = await fetch(openidConfig.discoveryConfig.revocation_endpoint, {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Basic ${Buffer.from(`${openidConfig.clientId}:${openidConfig.clientSecret}`).toString('base64')}`,
        },
      });
      if (!response.ok) {
        console.log(await response.text());
      }
    }
    req.session.tokens = null;

    res.redirect(302, '/');
  } catch (err) {
    next(err);
  }
});

export default router;
