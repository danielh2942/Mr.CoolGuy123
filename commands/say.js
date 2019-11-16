function give_message(args) {
	let phrase = '';
	for (let i = 0; i < (args.length); i++) {
		phrase = phrase + args[i] + ' ';
	}
	return phrase;
}

module.exports = {
	name: 'say',
	description: 'Say!',
	execute(message, args) {
		const phrase = give_message(args);
		message.channel.send(phrase);
	},
};