import express from 'express';

const port = 3000;

const app = express();

app.get('/', (req, response) => {
  response.json('Hello world!\n');
});

app.listen(port);