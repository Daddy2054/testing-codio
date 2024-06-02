import express from 'express';

const port = 3000;

const app = express();

app.get('/', (request, response) => {
    const text = request.query.text;
    if (request.query.text === undefined) {
        return response.status(400).json('Text is required');
    }
    //   response.json(request.query.text);
    const times = Math.max(parseInt(request.query.times, 10) || 1, 1);
    const echoedResult = Array(times).fill(text);
    response.json(echoedResult);
});

app.listen(port);