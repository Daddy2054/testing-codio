// FREEZE CODE BEGIN
import express from 'express';
const port = 3000;
const app = express();
// FREEZE CODE END
app.get('/', (req, response) => {
  response.send('Hello world!');
});
// WRITE YOUR CODE HERE

// FREEZE CODE BEGIN
app.listen(port);
// FREEZE CODE END
