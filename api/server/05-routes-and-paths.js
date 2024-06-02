import express from 'express';
import sqlite3 from 'sqlite3';

const port = 3000;

const app = express();

let db = new sqlite3.Database('pets.db',(err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

app.get('/pets', (req, res) => {
  db.all('SELECT * FROM pets',(err, items) => {
    if (err) {
      res.status(500).json({'error': err.message});
      return;
    }
    if (!items) {
      res.status(200).json('Pets is not found');
      return;
    }
    res.status(200).json(items);
  });
});

app.get('/pets/:petId', (req, res) => {
  db.get('SELECT * FROM pets WHERE id = ?', [req.params.petId], (err, item) => {
    if (err) {
      res.status(500).json({'error':err.message});
      return;
    }
    if (!item) {
      res.status(404).json('The requested pet is not found');
      return;
    }
    res.status(200).json(item);
  });
});

app.get('/pets/:petId/checkups', (req, res) => {
  db.all('SELECT * FROM checkups WHERE pet_id = ?', [req.params.petId], (err, items) => {
    if (err) {
      res.status(500).json({'error': err.message});
      return;
    }
    if (!items) {
      res.status(200).json('Checkups not found');
      return;
    }
    res.status(200).json(items);
  });
});

app.get('/pets/:petId/checkups/:checkupId', (req, res) => {
  db.get('SELECT * FROM checkups WHERE pet_id = ? AND id = ?', [req.params.petId, req.params.checkupId], (err, item) => {
    if (err) {
      res.status(500).json({'error':err.message});
      return;
    }
    if (!item) {
      res.status(404).json('The requested checkup is not found');
      return;
    }
    res.status(200).json(item);
  });
});

app.listen(port);
