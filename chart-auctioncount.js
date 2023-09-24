const axios = require('axios');

const currentTimestamp = Math.floor(Date.now() / 1000);

// Calculate the Unix timestamp of 1 week ago
const timeFilter = currentTimestamp - (7 * 24 * 60 * 60);


const graphqlQuery = `

{
  liens(where: {auctionStarted_not: null, auctionStarted_gt: ${timeFilter}}) {
    auctionStarted
    collection
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

function getCalDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

function getHourFromTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  return date.getHours(); // Get the hour component (0-23)
}

function getDateHourFromTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:00`; // Combine date and hour
}

function getDateHourFromTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(Math.floor(date.getHours() / 2) * 2).padStart(2, '0'); // Round hour to nearest multiple of 2
  return `${day} ${hour}:00`; // Combine date and hour
}


// Send the GraphQL query
axios(graphQLRequest)
  .then((response) => {



    const data = response.data.data;

    const recordsByDateHour = {};

    data.liens.forEach((lien) => {
      const dateHour = getDateHourFromTimestamp(lien.auctionStarted);
      if (!recordsByDateHour[dateHour]) {
        recordsByDateHour[dateHour] = 1;
      } else {
        recordsByDateHour[dateHour]++;
      }
    });

    // Create an array of objects with date-hour and count
    const dateHourCountArray = Object.entries(recordsByDateHour).map(([dateHour, count]) => ({ dateHour, count }));

    // Sort the dateHourCountArray by date-hour
    dateHourCountArray.sort((a, b) => a.dateHour.localeCompare(b.dateHour));

    // Extract dateHourArray and countArray from the sorted dateHourCountArray
    const dateHourArray = dateHourCountArray.map((entry) => entry.dateHour);
    const countArray = dateHourCountArray.map((entry) => entry.count);

    // Create the final dataset object
    const dataset = { dateHour: dateHourArray, count: countArray };
    console.log(dataset);



  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });
