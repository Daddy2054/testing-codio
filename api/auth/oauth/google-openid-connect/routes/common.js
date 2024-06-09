import crypto from 'node:crypto';
import * as jose from 'jose';
import fetch, { FormData } from 'node-fetch';

export async function checkOAuthTokens(req, res, next) {
  try {
    // The authentication service sets in the `exp` property the timestamp after which the ID token is not valid.
    if (req.session.tokens && req.session.tokens.id.exp * 1000 < Date.now()) {
      const openidConfig = req.app.get('openid');

      const form = new FormData();
      form.append('grant_type', 'refresh_token');
      form.append('refresh_token', req.session.tokens.refresh);

      // This will try to refresh the access and ID tokens.
      // You can see in more detail in the specification of OAuth: https://www.rfc-editor.org/rfc/rfc6749#section-6
      const response = await fetch(openidConfig.discoveryConfig.token_endpoint, {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Basic ${Buffer.from(`${openidConfig.clientId}:${openidConfig.clientSecret}`).toString('base64')}`,
        },
      });
      if (response.ok) {
        const responseJson = await response.json();
        // This will verify the returned ID token. More on it in auth.js
        const idVerifyResult = await jose.jwtVerify(responseJson.id_token, openidConfig.jwks, {
          audience: openidConfig.clientId,
          issuer: openidConfig.discoveryConfig.issuer,
        });
        const idTokenPayload = idVerifyResult.payload;
        req.session.tokens = {
          access: responseJson.access_token,
          // The OAuth service may return a new refresh token. Otherwise use the old one.
          refresh: responseJson.refresh_token || req.session.tokens.refresh,
          // The updated ID token may return only part of the information that was in the original ID token.
          // That's why we use the old token as a base object and rewrite with the new data.
          id: Object.assign(req.session.tokens.id, idTokenPayload),
        };

        console.log(req.session.tokens.id);
      } else {
        req.session.tokens = null;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

export function sha256Digest(buffer) {
  return crypto.createHash('sha256')
    .update(buffer)
    .digest();
}
