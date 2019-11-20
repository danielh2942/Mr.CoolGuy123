function get_numdays() {
	// Gets time difference and stuff
	let	numOfDays = 0;
	const timeOfDeath = Date.parse('2013/04/08');
	const timeNow = Date.now();
	const difference = timeNow - timeOfDeath;
	numOfDays = Math.floor(difference / 8.64e+7);
	return numOfDays;
}

module.exports = {
	name: 'timesincethatcher',
	description: 'prints days since thatcher\'s death in days, and an image of her grave',
	execute(message, args) {
		if (args[0] == "--thatcher") {
			const numOfDays = get_numdays();
			message.channel.send("It has been " + numOfDays + " days since Thatcher has died");
			message.channel.send("Here's a picture of Thatcher's grave", { file: ("https://upload.wikimedia.org/wikipedia/commons/e/e3/MTgrave2.jpeg") });
		}
	},
	checker(client, channel) {
		// eslint-disable-next-line no-unused-vars
		const message = client.channels.get(channel);
		const numOfDays = get_numdays();
		message.send("It has been " + numOfDays + " days since Thatcher has died");
		message.send("Here's a picture of Thatcher's grave",
			{ file: ("https://upload.wikimedia.org/wikipedia/commons/e/e3/MTgrave2.jpeg") });
	},
};
