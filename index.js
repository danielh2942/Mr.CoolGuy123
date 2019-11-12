const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(message.content);
	if (message.content === 'Okay') {
		message.channel.send('This is epic ~Ben Shapiro');
	}
});

client.login(config.token);