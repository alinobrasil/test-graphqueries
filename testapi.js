const axios = require('axios');

const currentTimestamp = Math.floor(Date.now() / 1000);

// Calculate the Unix timestamp of X minutes ago
const timeFilter = currentTimestamp - (600 * 60);


const graphqlQuery = `

{
  liens(
    orderBy: auctionStarted
    orderDirection: desc
    where: {auctionStarted_gt: "${timeFilter}"}
  ) {
    auctionStarted
    id
    collection
    borrower
    tokenId
  }
}

`;

// console.log(graphqlQuery)

const graphQLRequest = {
  method: 'post',
  url: 'https://api.studio.thegraph.com/query/53192/blend/0.0.26',
  data: {
    query: graphqlQuery,
  },
};

// Send the GraphQL query
axios(graphQLRequest)
  .then((response) => {
    // Handle the response here
    const data = response.data.data
    console.log(data)

  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });
