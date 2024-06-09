import express from 'express';
import sqlite3 from 'sqlite3';
import swaggerUi from 'swagger-ui-express';


import * as fs from 'fs';
const swaggerFile = JSON.parse(fs.readFileSync('./swagger_output.json'));

const app = express();


const port = 3000;



app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());


let db = new sqlite3.Database('pets.db',(err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
//curl -s http://localhost:3000/pets?kind=dog
// ignore the case of the pet kind




app.get('/pets', (req, res) => {
  db.all('SELECT * FROM pets WHERE LOWER(kind) = LOWER(?)', [req.query.kind], (err, items) => {
    if (err) {
      res.status(500).json({'error': err.message});
      return;
    }
    res.status(200).json(items);
  });
})
// app.get('/pets', (req, res) => {
//   db.all('SELECT * FROM pets',(err, items) => {
//     if (err) {
//       res.status(500).json({'error': err.message});
//       return;
//     }
//     res.status(200).json(items);
//   });
// });


function loadOne(id, callback) {
  db.get('SELECT * FROM pets WHERE id = ?', id, callback);
}

app.get('/pets/:petId', (req, res) => {
  loadOne(req.params.petId, (err, item) => {
    if (err) {
      res.status(500).json({'error':err.message});
      return;
    }
    if (!item) {
      res.status(404).json({'error': 'The requested pet is not found'});
      return;
    }
    res.status(200).json(item);
  });
});


app.post('/pets', (request, response) => {
  console.log(request.body);
  db.get(`INSERT INTO pets (kind, name) VALUES (?, ?) RETURNING id`, [request.body.kind, request.body.name],
    (err, result) => {
      if (err) {
        response.status(500).json({'error': err.message});
        return;
      }
      loadOne(result.id, (err, item) => {
        if (err) {
          response.status(500).json({'error':err.message});
          return;
        }
        response.status(201).json(item);
      });
    });
});

app.delete('/pets/:petId', (request, response) => {
  db.run('DELETE FROM pets WHERE id = ?', [request.params.petId], (err, item) => {
    if (err) {
      response.status(500).json({'error':err.message});
      return;
    }
    response.sendStatus(204);
  });
});

app.put('/pets/:petId', (request, response) => {
  db.run(`UPDATE pets SET kind = ?, name = ? WHERE id = ?`, [request.body.kind, request.body.name, request.params.petId],
    (err, result) => {
      if (err) {
        response.status(500).json({'error': err.message});
        return;
      }
      response.status(200).json({
        'id': request.body.id, 
        'kind': request.body.kind, 
        'name': request.body.name
      });
    });
});

// Add your checkups endpoint here
// WRITE YOUR CODE HERE

app.get('/pets/:petId/checkups', (req, res) => {
  db.all('SELECT * FROM checkups WHERE pet_id = ?', [req.params.petId], (err, items) => {
    if (err) {
      res.status(500).json({'error': err.message});
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
      res.status(404).json({'error': 'The requested checkup is not found'});
      return;
    }
    res.status(200).json(item);
  });
});

app.delete('/pets/:petId/checkups/:checkupId', (req, res) => {
  db.run('DELETE FROM checkups WHERE pet_id = ? AND id = ?', [req.params.petId, req.params.checkupId], (err, item) => {
    if (err) {
      response.status(500).json({'error':err.message});
      return;
    }
    response.sendStatus(204);
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

