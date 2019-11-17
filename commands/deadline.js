//	deadline.js	- Half assed deadline tracker
const fs = require('fs');
const jsonObj = require("./deadlines.json");
const Schedule = require("node-schedule");

const deadlines = jsonObj.deadlines;

function deadlines_fetch() {
	let output = '';
	for (i in deadlines) {
		console.log('checking deadlines');
		output = '**ID:**\t' + deadlines[i].id + '\t**Subject:**\t' + deadlines[i].subject + '\t-\t' + deadlines[i].topic + '\t**Due Date:**\t' + deadlines[i].due_date + '\t' + deadlines[i].due_time + '\n';
	}
	return output;
}
/*
// Daily Check for recurrence at 8:30 am lol
let rule = Schedule.RecurrenceRule();
rule.hour = 8;
rule.minute = 30;

let check = Schedule.scheduleJob(rule, function() { 
	
	// function to warn people, based on date now and date of asssignment
	// please to look over
	// for conveinence ( in order for this code to work), it is possible to format date for json as the standard format
	// i.e. deadlines.json due_date is listed as e.g. Sun Nov 17 2019
	const date = new Date();
	let timeNow = date.toLocaleTimeString();
	let dateNow = date.toDateString();
	let timeDeadline = jsonObj.deadlines[i].due_time;


	for (i in deadlines) {
	    if (jsonObj.deadlines[i].due_date == dateNow) {
	        message.channel.send('WARNING: Assignment ' + jsonObj.deadlines[i].topic + ' is due today!!!');
	        // there isn't really a better way to describe the deadlines
	        // apart from id
	        // add a name field?
		// 
		// The topic field is the name/nature of the assignment
	    }
	}

});
*/	
function refresh_deadlines() {
	//	TODO:	Needs to update deadlines.json file
	//			Rather than just reassociating jsonObj.deadlines
	jsonObj.deadlines = deadlines;
	fs.writeFile("./deadlines.json", JSON.stringify(jsonObj), function(err) {
		if(err) console.log('ERROR: Could not write to File');
	});
}
let i = 0;
module.exports = {
	name: 'deadline',
	description: 'Reminds you of upcoming assignment deadlines!',
	execute(message, args) {
		let output = '';
		if (args[0] == '--add') {
			//	TODO: stricter formatting - Exclusively using alotted course codes etc.
			//	Example Formatting
			//	!deadline --add SUBJECT DATE TIME TOPIC
			message.channel.send('**Setting Deadline**');
			// 	a holds the highest ID value lol.
			let a = 0;
			//	b holds the start of the trailing arguements lol
			let b = 4;
			if deadlines.subject.includes(args[1]) {
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
			refresh_deadlines();
		}
		else if (args[0] == '--remove') {
			//	Example formatting
			//	!deadline --remove ID
			message.channel.send('**Removing Deadline**');
			const idtag = parseInt(args[1]);
			let in_list = 0;
			//	Obvious check to ensure that the ID you want rid of is an actual number lol
			if (!isNaN(idtag)) {
				for (i in deadlines) {
					if (deadlines[i].id === idtag) {
						deadlines.splice(i, 1);
						in_list = 1;
						break;
					}
				}
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
			refresh_deadlines();
		}
		else if (args[0] == '--update') {
			//	formatting
			//	!deadline --update ID NEWDATE NEW TIME
			message.channel.send('**Updating Deadline**');
			for (i in deadlines) {
				if (args[1] === deadlines[i].id) {
					deadlines[i].due_date = args[2];
					deadlines[i].due_time = args[3];
					break;
				}
			}
			message.channel.send('**ID**\t' + args[1] + '\tHas been successfully updated!');
			refresh_deadlines();
		}
		else if (args[0] == '--check') {
			message.channel.send('**Here are all upcoming deadlines**');
			output = deadlines_fetch(deadlines);
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
};
