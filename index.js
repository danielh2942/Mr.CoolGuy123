const fs = require('fs');
const Discord = require('discord.js');
const Schedule = require('node-schedule');
const { prefix, token, announce } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
let prev_author = '';
let prev_count = 0;
//	Commands are processed here lots of tasty boilerplate!
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('Being a Gnome :3');
	//	epic status for the bot
});
//	Message Handling Again, More Boilerplate!
client.on('message', message => {
	if (!message.content.startsWith(prefix)) {
		//	This is the epic script
		if(message.author.username == prev_author) {
			prev_count++;
			if (prev_count == 8) {
				const id = "<@" + message.author.id + ">";
				message.channel.send("Shut the fuck up " + id);
			}
		}
		else {
			prev_author = message.author.username;
			prev_count = 1;
		}
		return;
	}
	//	How this works is it truncates the first thing after the prefix from
	//	The rest and then proceeds to search the previously generated array for
	//	A file with the same name as the command called and attempts to run it
	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) {
		//	As of yet !help does not exist lol
		if (commandName === 'help') {
			let i = 0;
			message.channel.send('Here are all possible commands: ');
			console.log(client.commands);
			const list_commands = Array.from(client.commands);
			for (i in client.commands) {
				message.channel.send(list_commands[i].name + '\t' + list_commands[i].description);
			}
		}
		else {
			message.channel.send('That command does not exist! try !help to see availible commands!');
		}
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

const j = Schedule.scheduleJob({ hour: 23, minute: 20, dayOfWeek: 6 }, function() {
	client.channels.get(announce).send("!deadline --check");
});

client.login(token);