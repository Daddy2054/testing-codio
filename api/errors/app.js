const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./openapi.json');

const port = 3000;

const todos = [
  {id: 1, title: 'buy the milk'},
  {id: 2, title: 'rent a car'}, 
  {id: 3, title: 'feed the cat'}
];

function error(status, msg) {
  const err = new Error(msg);
  err.status = status;
  return err;
}

app.use(express.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.get('/', (req, res) => {
  res.status(200).json(todos);
});

app.post('/', (request, response) => {
  console.log(request.body);
  const newTodo = request.body;
  newTodo.id = todos.length +1;
  todos.push(newTodo);
  response.status(201).json(newTodo);
});

app.get('/:id', (request, response) => {
  console.log(request.params);
  const reqId = parseInt(request.params.id, 10);
  const todo = todos.find(t => t.id === reqId);
  console.log(todo);
  if (todo === undefined) {
    const err = new Error(`Could not find the item with id: ${reqId}`);
    err.status = 404;
    throw err;
  } else {
    response.status(200).json(todo);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

app.use((req, res) => {
  res.status(404);
  res.send({ error: "Sorry, can't find that" });
});

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;
