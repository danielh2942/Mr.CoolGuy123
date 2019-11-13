const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();

//	Commands are processed here lots of tasty boilerplate!
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
});
//	Message Handling Again, More Boilerplate!
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//	How this works is it truncates the first thing after the prefix from
	//	The rest and then proceeds to search the previously generated array for
	//	A file with the same name as the command called and attempts to run it
	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) {
		//	As of yet !help does not exist lol
		message.channel.send('That command does not exist! try !help to see availible commands!');
		return;
	}

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
