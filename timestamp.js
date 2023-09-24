

// Ethereum block timestamp
const ethereumBlockTimestamp = 1695361319;

function getDate(blockTimeStamp) {
    // Create a JavaScript Date object by multiplying the timestamp by 1000 (to convert seconds to milliseconds)
    const date = new Date(ethereumBlockTimestamp * 1000);

    // Extract year, month, day, hour, minute, and second components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    // Format the date components as a human-readable string
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

    console.log(formattedDate);
}

getDate(ethereumBlockTimestamp)
