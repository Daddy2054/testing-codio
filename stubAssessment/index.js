const request = require('request');

const getAddressById = (id) => {
  const requestUrl = `https://jsonplaceholder.typicode.com/users/${id}/`;
  return new Promise((resolve, reject) => {
    request.get(requestUrl, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      // console.log(body);
      resolve(JSON.parse(body).address);
    });
  });
};

module.exports = getAddressById;