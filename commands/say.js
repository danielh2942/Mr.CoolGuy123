module.exports = {
	name: 'say',
	description: 'Say!',
	execute(message, args) {
		let phrase = '';
		for (let i = 0; i < (args.length); i++) {
			phrase = phrase + args[i] + ' ';
		}
		message.channel.send(phrase);
	},
};
