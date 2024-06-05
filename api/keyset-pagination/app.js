import crypto from 'node:crypto';
import process from 'node:process';

import express from 'express';
import Database from 'better-sqlite3';
import LinkHeader from 'http-link-header';

const port = 3000;

// This will be needed to correctly link to the next batch.
let baseUrl = `http://localhost:${port}`;
if (process.env['CODIO_HOSTNAME']) {
  baseUrl = `https://${process.env['CODIO_HOSTNAME']}-${port}.codio.io`;
}

// Let's limit the number of objects in the batch by 5.
const pageSize = 5;

// This will be needed to encrypt the cursor that will be returned to the client.
// Normally the key would be in the config.
// The length of the key needs to correspond to the encryption algorithm.
// This example key is 32 bytes which is appropriate for aes-256-cbc.
const cursorKey = Buffer.from('wIVHpvwTnWpXfA+l1pkYa3fYN+eGuflXghcO7NXwOL8=', 'base64');
const cursorAlgo = 'aes-256-cbc';
// This is an initialization vector required for the encryption algorithm.
// It doesn't have to be in the config, this will be sent to the client and then received back from it.
const cryptoIV = crypto.randomBytes(16);


const app = express();

app.use(express.json());

const db = new Database('pets.db', {verbose: console.log});

app.get('/pets', (req, res) => {
  let items;
  let kindFilter;
  if (!req.query.cursor) {
    // When it is a request of the first batch of the data, there will be no cursor query parameter.
    // Stable ordering is required for the pagination, otherwise the results may be inconsistent.
    //E.g. the next page may have duplicate items.
    kindFilter = req.query.kind;
    if (kindFilter) {
      items = db
        .prepare('SELECT * FROM pets WHERE kind = ? COLLATE NOCASE ORDER BY kind ASC, name ASC, id ASC LIMIT ?')
        .all(kindFilter, pageSize);
    } else {
      items = db
        .prepare('SELECT * FROM pets ORDER BY kind ASC, name ASC, id ASC LIMIT ?')
        .all(pageSize);
    }
  } else {
    const nextPageCursor = JSON.parse(decryptCursor(req.query.cursor));
    // The cursor for the next page contains the saved query filter, we ignore the filter from the parameter from the current request.
    kindFilter = nextPageCursor.kindFilter;
    // The other condition in WHERE is based on the saved keyset, see below.
    // The compared keys have to be the same as the keys on which the order is based.
    if (kindFilter) {
      items = db
      .prepare('SELECT * FROM pets WHERE kind = ? COLLATE NOCASE AND (kind, name, id) > (?, ?, ?) ORDER BY kind ASC, name ASC, id ASC LIMIT ?')
      .all(kindFilter, nextPageCursor.kind, nextPageCursor.name, nextPageCursor.id, pageSize);
    } else {
      items = db
      .prepare('SELECT * FROM pets WHERE (kind, name, id) > (?, ?, ?) ORDER BY kind ASC, name ASC, id ASC LIMIT ?')
      .all(nextPageCursor.kind, nextPageCursor.name, nextPageCursor.id, pageSize);
    }
  }
  
  // Add the link to the next batch of data only if there are more data available.
  // This way the client will know when to stop requesting the next batch.
  if (items.length === pageSize) {
    const lastItem = items[items.length - 1];
    const nextPageCursor = encryptCursor(JSON.stringify({kind: lastItem.kind, name: lastItem.name, id: lastItem.id, kindFilter: kindFilter}));

    const params = new URLSearchParams();
    params.append('cursor', nextPageCursor);

    // There are various ways to link to the next page. 
    // It would be possible to add the link in the object that "envelopes" the data set.
    // But in this case we have chosen the approach which is standardized in RFC8288.
    // It sends the link as a part of `Link` header in a particular format which is handled for us by 'http-link-header' library
    const linkHeader = new LinkHeader();
    linkHeader.set({rel: 'next', uri: `${baseUrl}/pets?${params.toString()}`});

    res.set('Link', linkHeader.toString());
  }

  res.status(200).json(items);
});

// We encrypt the cursor parameter to prevent tampering by the client.
function encryptCursor(str) {
  const cipher = crypto.createCipheriv(cursorAlgo, cursorKey, cryptoIV);
  // We put the cursor into the query parameter, that's why we encode it with `base64url` which is safe for that.
  const encrypted = cipher.update(str, 'utf8', 'base64url') + cipher.final('base64url');
  // We also include the initialization vector too.
  // This way if the next request will arrive to another server in the cluster it will be able to decrypt it.
  return encrypted + ':' + cryptoIV.toString('base64url');
}

// We decrypt and decode the cursor parameter the same way we encrypt and encoded it, in the reverse order.
function decryptCursor(str) {
  const parts = str.split(':');
  const cipherText = parts[0];
  const iv = Buffer.from(parts[1], 'base64url');
  const decipher = crypto.createDecipheriv(cursorAlgo, cursorKey, cryptoIV);
  return decipher.update(cipherText, 'base64url', 'utf8') + decipher.final('utf8');
}

function loadOne(id) {
  return db.prepare('SELECT * FROM pets WHERE id = ?').get(id);
}

app.get('/pets/:petId', (req, res) => {
  const item = loadOne(req.params.petId);
  if (!item) {
    res.status(404).json({'error': 'The requested pet is not found'});
    return;
  }
  res.status(200).json(item);
});

app.post('/pets', (request, response) => {
  console.log(request.body);
  const result = db
    .prepare('INSERT INTO pets (kind, name) VALUES (?, ?) RETURNING id')
    .get(request.body.kind, request.body.name);

  const item = loadOne(result.id);
  response.status(201).json(item);
});

app.delete('/pets/:petId', (request, response) => {
  db
    .prepare('DELETE FROM pets WHERE id = ?')
    .run(request.params.petId);

  response.sendStatus(204);
});

app.put('/pets/:petId', (request, response) => {
  db
    .prepare('UPDATE pets SET kind = ?, name = ? WHERE id = ?')
    .run(request.body.kind, request.body.name, request.params.petId);

  response.status(200).json({
    'id': request.body.id, 
    'kind': request.body.kind, 
    'name': request.body.name
  });
});


app.get('/pets/:petId/checkups', (req, res) => {
  const items = db
    .prepare('SELECT * FROM checkups WHERE pet_id = ?')
    .all(req.params.petId);

  res.status(200).json(items);
});

app.get('/pets/:petId/checkups/:checkupId', (req, res) => {
  const item = db
    .prepare('SELECT * FROM checkups WHERE pet_id = ? AND id = ?')
    .all(req.params.petId, req.params.checkupId);

  if (!item) {
    res.status(404).json({'error': 'The requested checkup is not found'});
    return;
  }
  res.status(200).json(item);
});

app.delete('/pets/:petId/checkups/:checkupId', (req, res) => {
  db
    .prepare('DELETE FROM checkups WHERE pet_id = ? AND id = ?')
    .run(req.params.petId, req.params.checkupId);

  response.sendStatus(204);
});

app.listen(port);
