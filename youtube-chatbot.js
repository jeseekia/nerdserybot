const {google} = require('googleapis');
require('dotenv').config();

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
});

const params = {
    liveChatId: '',
    part: '' //need to choose id, snippet, authorDetails
}

youtube.liveChatMessages.list(params)
    .then(res => {
        //liveChatMessage
        
    })
    .catch(error => {
        console.error(error);
    });