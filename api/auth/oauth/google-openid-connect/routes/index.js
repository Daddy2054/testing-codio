import express from 'express';

import { checkOAuthTokens } from './common.js';

const router = express.Router();

function escapeHtmlEntities(htmlStr) {
  return htmlStr.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

router.get('/', checkOAuthTokens, (req, res) => {
  // checkOAuthTokens middleware will check the tokens, see common.js
  if (req.session.tokens) {
    const idRow = `<tr><td>Id:</td><td>${escapeHtmlEntities(req.session.tokens.id.sub)}</td></tr>`;
    const emailRow = !req.session.tokens.id.email ? '' : `<tr><td>Email:</td><td>${escapeHtmlEntities(req.session.tokens.id.email)}</td></tr>`;
    const nameRow = !req.session.tokens.id.name ? '' : `<tr><td>Name:</td><td>${escapeHtmlEntities(req.session.tokens.id.name)}</td></tr>`;
    const pictureRow = !req.session.tokens.id.picture ? '' : `<tr><td>Picture:</td><td><img src="${req.session.tokens.id.picture}"/></td></tr>`;
    const userDataTable = `<table>${idRow}${nameRow}${emailRow}${pictureRow}</table>`;

    return res.status(200).send(`${userDataTable}<br/><a href="/logout">Log out</a>`);
  }

  const errorPrefix = !req.session.lastAuthError ? '' : `There was an error: ${req.session.lastAuthError}<br/>`;
  res.status(200).send(`${errorPrefix}<a href="/login">Log in using Google</a>`);
});

export default router;
