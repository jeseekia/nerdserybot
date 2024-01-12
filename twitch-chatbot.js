const tmi = require('tmi.js');
const https = require('https');
const { exec } = require('child_process');
require('dotenv').config();

// Perform Twitch Device Code Grant Flow using Curly
// curl --location 'https://id.twitch.tv/oauth2/device'\
// --form'client_id="<clientID>"'\
// --form'scopes="<scopes>"'
let device_curl_command = `curl --location 'https://id.twitch.tv/oauth2/device' --form client_id=${process.env.TWITCH_CLIENT_ID} --form scopes="chat:read chat:edit"`
let token_curl_command = `curl --location 'https://id.twitch.tv/oauth2/token' --form client_id=${TWITCH_CLIENT_ID} --form scope="chat:read chat:edit" --form device_code=${TWITCH_DEVICE_CODE} --form grant_type="urn:ietf:params:oauth:grant-type:device_code"`

exec(curl_command, (error, stdout, stderr) => {
  if (error) {
    console.log("Error: Could not process curl command for device code and verification uri");
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.log("Stderr: ");
    console.error(`stderr: ${stderr}`);
    // return;
  }
  console.log(`stdout: ${stdout}`);
  // process.env.TWITCH_DEVICE_CODE = stdout.device_code;
  //Wait for user to verify

  //Execute token_curl_command

  // process.env.TWITCH_OAUTH_TOKEN = access_token;
  // process.env.TWITCH_REFRESH_TOKEN = refresh_token;
});

// {
//   "device_code": "ike3GM8QIdYZs43KdrWPIO36LofILoCyFEzjlQ91",
//   "expires_in": 1800,
//   "interval": 5,
//   "user_code": "ABCDEFGH",
//   "verification_uri": "https://www.twitch.tv/activate?public=true&device-code=ABCDEFGH"
// }


// curl --location 'https://id.twitch.tv/oauth2/token'\
//     --form'client_id="<client_id>"'\
//     --form'scope="<scope>"'\
//     --form'device_code="<device_code>"'\
//     --form'grant_type="urn:ietf:params:oauth:grant-type:device_code"'


// {
//   "access_token": "<access_token>",
//   "expires_in": <some_int_value>,
//   "refresh_token": "<refresh_token>",
//   "scope": [
//       "<scopes>"
//   ],
//   "token_type": "bearer"
// }

// Store tokens

// Define configuration options
const opts = {
  identity: {
    username: process.env.ACCOUNT_USERNAME,
    password: process.env.PASSWORD
  },
  channels: [
    process.env.INTERACTION_CHANNEL
  ]
};

const webhook = {
  url: process.env.WEBHOOK_URL
}

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect().catch((error) => {
  console.log("Could not connect to Twitch");
  console.log(error);
  //Attempt token refresh
  
});

// Agenda item store
agendaItems = [];

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  // TODO: Ignore non-bot messages

  console.log("<----- Context ----->")
  console.log(context)

  //breakup msg by whitespace
  const msgContents = msg.split(' ')
  //set command
  const commandName = msgContents[0]


  if (commandName === '!dice') {
    client.say(target, `You rolled a ${rollDice()}`);
    console.log(`* Executed ${commandName} command`);
  }

  if (commandName === '!hey') {
    client.say(target, heyUser(msgContents[1]));
  }

  //Poke the bot redemption
  if (context['custom-reward-id'] === 'c209b616-abc1-45ec-8b90-bf1ebc8ba3bc') {
    client.say(target, `Why you boooli me??? BibleThump BibleThump BibleThump`);
  }

  if (context['subscriber']){

    if (commandName === '!link') {
      client.say(target, "Thanks for sharing!");
      sendLinkToDiscord(msgContents[1], context['display-name']);
    }

  }

  if (commandName === '!agenda'){

    if (msgContents[1]) {

      if (context['mod'] || isBroadcaster(context['badges'])){
        agendaItems = msgContents.slice(1);
      } else {
        client.say(target, "You don't have permission to set the agenda.");
      }

    }
    client.say(target, `Current agenda: ${generateAgenda(agendaItems)}`);

  }


}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

function heyUser(user){
  return `Hey ${user}! Welcome to The Nerdsery.`
}

function sendLinkToDiscord(urlToPost, displayName) {

  let params = {
    username: displayName,
    avatar_url: '',
    content: urlToPost
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = https.request(webhook['url'], options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
      process.stdout.write(d)
    });
  });

  req.on('error', error => {
    console.error(error);
  });

  req.write(JSON.stringify(params));
  req.end();

}

function isBroadcaster(badges) {
  return badges['broadcaster'] === "1";
}

function generateAgenda(items){
  if (items.length === 0) {
    return 'No agenda is set';
  }
  return items.toString();
}


// curl -X POST 'https://id.twitch.tv/oauth2/device' \
// -H 'Content-Type: application/x-www-form-urlencoded' \
// -d 'client_id=<Your client id here>&scopes=chat:read chat:edit'