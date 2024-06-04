// FREEZE CODE BEGIN
import express from 'express';
const port = 3000;
const app = express();
// FREEZE CODE END
app.get('/', (request, response) => {
            response.send("Root");
});
app.get('/name', (request, response) => {
            response.send("Text");
});
app.get('/age', (request, response) => {
            response.send("19 years");
});
app.get('/description', (request, response) => {
            response.send("Text is here");
});


app.get('*', (req, res) => {
  res.send("Error 404 - Not found");
});

// WRITE YOUR CODE HERE

// FREEZE CODE BEGIN
app.listen(port);
// FREEZE CODE END
