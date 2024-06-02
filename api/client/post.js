//  FREEZE CODE BEGIN
import process from 'node:process';
import fetch from 'node-fetch';

//  FREEZE CODE END



// WRITE YOUR CODE HERE
const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
        title: 'My post title',
        body: 'My post body',
        userId: 1,
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
});
//   .then((response) => response.json())
//   .then((json) => console.log(json));
//  FREEZE CODE BEGIN

const data = await response.json();
console.log(data);
//  FREEZE CODE END