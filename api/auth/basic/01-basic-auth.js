import express from 'express';
import sqlite3 from 'sqlite3';

const port = 3000;

const app = express();

app.use((req, res, next) => {
  const auth = {login: 'yourlogin', password: 'yourpassword'}; // change this

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login && password && login === auth.login && password === auth.password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Basic Auth App"');
  res.status(401).send('Authentication required.');
});

const db = new sqlite3.Database('pets.db',(err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

app.get('/pets', (req, res) => {
  db.all('SELECT * FROM pets',(err, items) => {
    if (err) {
      res.status(400).json({'error': err.message});
      return;
    }
    res.status(200).json(items);
  });
});

app.get('/pets/:petId', (req, res) => {
  db.get('SELECT * FROM pets WHERE id = ?', [req.params.petId], (err, item) => {
    if (err) {
      res.status(400).json({'error':err.message});
      return;
    }
    if (!item) {
      res.status(404).json('The requested pet is not found');
      return;
    }
    res.status(200).json(item);
  });
});

app.delete('/pets/:petId', (request, response) => {
  db.run('DELETE FROM pets WHERE id = ?', [request.params.petId], (err) => {
    if (err) {
      response.status(400).json({'error':err.message});
      return;
    }
    response.sendStatus(204);
  });
});

app.get('/pets/:petId/checkups', (req, res) => {
  db.all('SELECT * FROM checkups WHERE pet_id = ?', [req.params.petId], (err, items) => {
    if (err) {
      res.status(400).json({'error': err.message});
      return;
    }
    res.status(200).json(items);
  });
});

app.get('/pets/:petId/checkups/:checkupId', (req, res) => {
  db.get('SELECT * FROM checkups WHERE pet_id = ? AND id = ?', [req.params.petId, req.params.checkupId], (err, item) => {
    if (err) {
      res.status(400).json({'error':err.message});
      return;
    }
    if (!item) {
      res.status(404).json('The requested checkup is not found');
      return;
    }
    res.status(200).json(item);
  });
});

app.delete('/pets/:petId/checkups/:checkupId', (req, res) => {
  db.run('DELETE FROM checkups WHERE pet_id = ? AND id = ?', [req.params.petId, req.params.checkupId], (err) => {
    if (err) {
      response.status(400).json({'error':err.message});
      return;
    }
    response.sendStatus(204);
  });
});

app.listen(port);
