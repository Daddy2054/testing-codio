const request = require('request');

const getCommentsById = (id) => {
    const requestUrl = `https://jsonplaceholder.typicode.com/posts/${id}/comments?_limit=3`;
    return new Promise((resolve, reject) => {
        request.get(requestUrl, (err, res, body) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(body));
        });
    });
};

module.exports = getCommentsById;