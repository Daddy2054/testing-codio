import fetch, {Headers} from 'node-fetch';
import process from 'node:process';

const petsListUrl = 'http://localhost:3000/pets';

const petsListResponse = await fetch(petsListUrl);

if (petsListResponse.status < 200 || petsListResponse.status >= 300) {
  console.log('Did not receive the success status: ', petsListResponse.status, petsListResponse.statusText);
  const body = await petsListResponse.text();
  console.log(body);

  process.exit(1);
}

const petsList = await petsListResponse.json();
console.log(petsList);

const userName = 'yourlogin';
const password = 'yourpassword';
const headers = new Headers();
headers.set('Authorization', 'Basic ' + Buffer.from(userName + ':' + password).toString('base64'));

const deletePetUrl = 'http://localhost:3000/pets/3';

const deletePetResponse = await fetch(deletePetUrl, {method: 'DELETE', headers: headers});

if (deletePetResponse.status < 200 || deletePetResponse.status >= 300) {
  console.log('Did not receive the success status: ', deletePetResponse.status, deletePetResponse.statusText);
  const body = await deletePetResponse.text();
  console.log(body);

  process.exit(1);
}

console.log('Success');