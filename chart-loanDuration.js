const axios = require('axios');

const currentTimestamp = Math.floor(Date.now() / 1000);

// Calculate the Unix timestamp of 1 week ago
const timeFilter = currentTimestamp - (7 * 24 * 60 * 60);


const graphqlQuery = `

{
  liens(where: {collection: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"}) {
    id
    collection
    tokenId
    borrower
    latestLoan: loans(orderBy: startTime, first: 1, orderDirection: desc) {
      id
      lienId
      lender
      loanAmount
    }
    repayTime
    seizeTime
    timeStarted
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



// Send the GraphQL query
axios(graphQLRequest)
  .then((response) => {



    const queryResult = response.data.data

    // Filter items that either have seizeTime or repayTime
    const filteredLiens = queryResult.liens.filter((lien) => {
      return lien.seizeTime !== null || lien.repayTime !== null;
    });

    // Create a new field called endTime based on the available value
    filteredLiens.forEach((lien) => {
      lien.endTime = lien.seizeTime !== null ? lien.seizeTime : lien.repayTime;
      delete lien.seizeTime; // Optionally, you can remove seizeTime and repayTime if needed
      delete lien.repayTime;
    });

    const loanDurationsByDate = {};


    // Iterate through filteredLiens to calculate loan durations and group them by date
    filteredLiens.forEach((lien) => {
      const date = new Date(lien.timeStarted * 1000).toISOString().split('T')[0]; // Convert timestamp to date

      if (!loanDurationsByDate[date]) {
        loanDurationsByDate[date] = [];
      }

      if (lien.endTime) {
        // Calculate the duration in seconds
        const durationInSeconds = lien.endTime - lien.timeStarted;
        loanDurationsByDate[date].push(durationInSeconds);
      }
    });

    // Calculate the average duration for each date
    const dateArray = [];
    const averageDurations = [];

    for (const date in loanDurationsByDate) {
      const durations = loanDurationsByDate[date];
      const totalDuration = durations.reduce((acc, duration) => acc + duration, 0);
      const averageDuration = totalDuration / durations.length;

      dateArray.push(date);
      averageDurations.push(averageDuration);
    }

    // Now 'dateArray' contains the dates, and 'averageDurations' contains the corresponding average durations

    // console.log('Date Array:', dateArray);
    // console.log('Average Durations:', averageDurations);


    const sortedData = dateArray.map((date, index) => ({
      date,
      averageDuration: averageDurations[index],
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Extract sorted dateArray and averageDurations
    const sortedDateArray = sortedData.map((data) => data.date);
    const sortedAverageDurations = sortedData.map((data) => data.averageDuration);

    // Convert averageDurations from seconds to minutes
    const averageDurationsInMinutes = sortedAverageDurations.map((durationInSeconds) => {
      const durationInMinutes = durationInSeconds / (60 * 60); // Convert seconds to hrs
      return Math.round(durationInMinutes); // Round to the nearest whole number of minutes
    });

    // Now 'sortedDateArray' contains the sorted dates,
    // and 'averageDurationsInMinutes' contains the corresponding average durations in minutes

    console.log('Sorted Date Array:', sortedDateArray);
    console.log('Average Durations (in hours):', averageDurationsInMinutes);


  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });
