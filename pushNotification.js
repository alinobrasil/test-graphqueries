const fetch = require('node-fetch'); // Import the fetch library for Node.js

// Replace these placeholders with actual values
const projectId = 'your-project-id';
const notifyApiSecret = 'your-api-secret';

// Define your notification payload
const notificationPayload = {
    title: "whats up yo",
    body: "Hack it until you make it!",
    url: "https://yahoo.com",
    type: "promotional",
};

(async () => {
    try {
        const result = await fetch(
            `https://notify.walletconnect.com/${projectId}/notify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${notifyApiSecret}`,
                },
                body: JSON.stringify(notificationPayload),
            }
        );

        // Check the response status and handle it accordingly
        if (result.status === 200) {
            const responseJson = await result.json();
            console.log('Success:', responseJson);
        } else {
            console.error('Request failed with status:', result.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
})();
