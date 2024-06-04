// FREEZE CODE BEGIN
import express from 'express';
const port = 3000;
const app = express();
// FREEZE CODE END
app.get('/', (request, response) => {
    const text = request.query.text;
    if (request.query.text === undefined) {
        return response.status(400).json('You must specify a query');
    }
        response.json(text);
});
// WRITE YOUR CODE HERE

// FREEZE CODE BEGIN
app.listen(port);
// FREEZE CODE END
