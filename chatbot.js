const tmi = require('tmi.js');
const https = require('https');

// Define configuration options
const opts = {
  identity: {
    username: 'thenerdsery',
    password: 'oauth:e8jbl0lcevmzyi8ao77dekc7q3tlga'
  },
  channels: [
    'metadevgirl'
  ]
};

const webhook = {
  url:'https://discordapp.com/api/webhooks/823394288175808533/CS7AxCmFMYAtpgw-lAB2uIj0ac3KnUssrJqQpJUrqQd0myk2ugMjFIKMGCgFbw6qHZJU'
}

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

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
