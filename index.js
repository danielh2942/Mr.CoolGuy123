const fs = require('fs');
const Discord = require('discord.js');
const Schedule = require('cron').CronJob;
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

// Monday 9am check lol
new Schedule('0 0 9 * * 1', function() {
	const command = client.commands.get('deadline');
	command.checker(client, announce, 1);
}, null, true, 'Europe/Dublin');
//	Daily covert deadline check
new Schedule('0 30 8 * * *', function() {
	let command = client.commands.get('deadline');
	command.checker(client, announce, 0);
	command = client.commands.get('timesincethatcher');
	command.checker(client, announce);
}, null, true, 'Europe/Dublin');

client.login(token);