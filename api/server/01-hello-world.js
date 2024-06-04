import express from 'express';

const port = 3000;

const app = express();

app.get('/', (req, response) => {
  // response.send('Hello world!');
  response.json('Hello world!\n');
});

app.listen(port);