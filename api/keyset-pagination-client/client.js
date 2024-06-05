import process from 'node:process';
import fetch from 'node-fetch';

import LinkHeader from 'http-link-header';

main();

async function main() {
  const port = 3000;

  let baseUrl = `http://localhost:${port}`;
  if (process.env['CODIO_HOSTNAME']) {
    baseUrl = `https://${process.env['CODIO_HOSTNAME']}-${port}.codio.io`;
  }

  let queryStr = '';
  if (process.argv.length > 2) {
    const params = new URLSearchParams();
    params.append('kind', process.argv[2]);
    queryStr = params.toString();
  }

  let response = await fetch(`${baseUrl}/pets?${queryStr}`);
  let nextPageLink;
  let pageNumber = 1;

  do {
    const data = await response.json();
    nextPageLink = getNextLink(response.headers.get('link'));
    if (data.length !== 0) {
      console.log('Page', pageNumber);
      console.table(data, ['kind', 'name']);
    }
    if (nextPageLink) {
      response = await fetch(nextPageLink);
    }
    ++pageNumber;
  } while (!!nextPageLink);
}

function getNextLink(linkHeader) {
  if (!linkHeader) {
    return;
  }

  const linkObjs = LinkHeader.parse(linkHeader).rel('next');
  if (linkObjs.length === 0) {
    return;
  }
  return linkObjs[0].uri;
}