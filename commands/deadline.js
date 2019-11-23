//	deadline.js	- Half assed deadline tracker
const fs = require('fs');
const jsonObj = require("./deadlines.json");
const Schedule = require('cron').CronJob;

function deadlines_fetch(channel) {
	let output = '';
	const server = get_server_deadlines(channel);
	const deadlines = server.deadlines;
	for (i in deadlines) {
		console.log('checking deadlines');
		//	Forgot to append results rip
		output = output + '**ID:**\t' + deadlines[i].id + '\t**Subject:**\t' + deadlines[i].subject + '\t-\t' + deadlines[i].topic + '\t**Due Date:**\t' + deadlines[i].due_date + '\t' + deadlines[i].due_time + '\n';
	}
	return output;
}
let server;
function get_server_deadlines(channel) {
	let a = 0;
	for (a in jsonObj.server) {
		if (jsonObj.server[a].name === channel) {
			server = jsonObj.server[a];
			break;
		}
	}
	return server;
}

//	Made in prep for the deadline task thing lol
function deadline_remove(idtag, channel) {
	server = get_server_deadlines(channel);
	const deadlines = server.deadlines;
	for (i in deadlines) {
		if (deadlines[i].id === idtag) {
			deadlines.splice(i, 1);
			refresh_deadlines();
			return 1;
		}
	}
	return 0;
}

function refresh_deadlines(channel, deadlines) {
	//	TODO:	Needs to update deadlines.json file
	//			Rather than just reassociating jsonObj.deadlines
	let i = 0;
	for (i in jsonObj.server) {
		if (jsonObj.server[i].name === channel) {
			jsonObj.server[i].deadlines = deadlines;
			break;
		}
	}
	fs.writeFile("./deadlines.json", JSON.stringify(jsonObj), function(err) {
		if(err) console.log('ERROR: Could not write to File');
	});
}

function deadline_warn(message, channel) {
	// function to warn people, based on date now and date of asssignment
	// please to look over
	// for conveinence ( in order for this code to work), it is possible to format date for json as the standard format
	// i.e. deadlines.json due_date is listed as e.g. Sun Nov 17 2019
	const date = new Date();
	// let timeNow = date.toLocaleTimeString();
	const dateNow = date.toDateString();
	// Get deadline from now restructured database
	server = get_server_deadlines(channel);
	const deadlines = server.deadlines;
	let timeDeadline = server.deadline[i].due_time;
	for (i in deadlines) {
		if (server.deadlines[i].due_date === dateNow) {
			message.send('WARNING: Assignment ' + server.deadlines[i].topic + ' is due today!!!');
			timeDeadline = server.deadlines[i].due_time;
			// there isn't really a better way to describe the deadlines
			// apart from id
			// add a name field?
			//
			// The topic field is the name/nature of the assignment
			//	It will set a reminder for the Job here I guess I'll work it out,
			//	Changed to cron as cron is allegedly guaranteed to run
			// SS MM HH DD MM Dayofweek(0-6)
			console.log('Alert Job set for ' + server.deadlines[i].ID + ' at ' + timeDeadline);
			new Schedule(timeDeadline, function() {
				console.log('Alert for ' + server.deadlines[i].id + ' has been completed');
				message.send('Deadline for ' + server.deadlines[i].topic + 'Has elapsed!');
				deadline_remove(server.deadlines[i].id);
			});
		}
	}
}
let i = 0;

module.exports = {
	name: 'deadline',
	description: 'Reminds you of upcoming assignment deadlines!',
	execute(message, args) {
		let output = '';
		if (args[0] == '--add') {
			server = get_server_deadlines(message.channel);
			const deadlines = server.deadlines;
			//	TODO: stricter formatting - Exclusively using alotted course codes etc.
			//	Example Formatting
			//	!deadline --add SUBJECT DATE TIME TOPIC
			message.channel.send('**Setting Deadline**');
			// 	a holds the highest ID value lol.
			let a = 0;
			//	b holds the start of the trailing arguements lol
			let b = 4;
			if (deadlines.subject.includes(args[1])) {
				//	Sets generic if subject is not real
				args[1] = "1BCT1";
			}
			for (i in deadlines) {
				(deadlines[i].id > a) ? a = deadlines[i].id : null;
				//	Duplicate Checking
				if (deadlines[i].subject === args[1] && deadlines[i].due_date === args[2]) {
					message.channel.send('**Deadline already exists!**');
					console.log('ERROR: deadline already exists\n' + args + '\nWith ID: ' + deadlines[i].id);
					return;
				}
			}
			//	One higher
			a++;
			while (b < args.length) {
				output = output + args[b] + ' ';
				b++;
			}
			deadlines[i + 1] = { "id" : a, "subject" : args[1], "topic" : output, "due_date" : args[2], "due_time" : args[3] };
			message.channel.send('Assignment **ID**\t' + a + '\tHas been added successfully!');
			refresh_deadlines(message.channel, deadlines);
		}
		else if (args[0] == '--remove') {
			//	Example formatting
			//	!deadline --remove ID
			message.channel.send('**Removing Deadline**');
			const idtag = parseInt(args[1]);
			let in_list = 0;
			//	Obvious check to ensure that the ID you want rid of is an actual number lol
			if (!isNaN(idtag)) {
				//	Made it into a function so the deadline alert can use it
				in_list = deadline_remove(idtag);
				if (in_list) {
					message.channel.send('Assignment removed successfully!');
				}
				else {
					message.channel.send('ID number:\t' + idtag + '\t was not found!');
				}
			}
			else {
				message.channel.send(args[1] + ' is not a valid number!');
				console.log('ERROR: Deadline - NAN Val: ' + args[1]);
			}
		}
		else if (args[0] == '--update') {
			//	formatting
			//	!deadline --update ID NEWDATE NEW TIME
			server = get_server_deadlines(message.channel);
			const deadlines = server.deadlines;
			message.channel.send('**Updating Deadline**');
			for (i in deadlines) {
				if (args[1] === deadlines[i].id) {
					deadlines[i].due_date = args[2];
					deadlines[i].due_time = args[3];
					break;
				}
			}
			message.channel.send('**ID**\t' + args[1] + '\tHas been successfully updated!');
			refresh_deadlines(message.channel, deadlines);
		}
		else if (args[0] == '--check') {
			message.channel.send('**Here are all upcoming deadlines**');
			output = deadlines_fetch(message.channel);
			message.channel.send(output);
		}
		else if (args[0] == '--help') {
			//	TODO: This.
			message.channel.send('**Here are all possible commands**');
		}
		else {
			//	Mandatory Error Handling
			message.channel.send('Invalid operator, please use --help to get all possible commands');
			console.log('Deadline: error - Invalid operator ' + args[0]);
		}
	},
	checker(client, channel, announce) {
		const message = client.channels.get(channel);
		if (announce) {
			message.send("Happy Monday <@everyone> here are this weeks assignments!");
			const output = deadlines_fetch();
			message.send(output);
		}
		else {
			deadline_warn(message, channel);
		}
	},
};