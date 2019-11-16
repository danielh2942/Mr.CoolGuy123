module.exports = {
	//	This was made just for my own convenience I guess lol
	name: 'chart',
	description: 'Gets lastfm charts innit',
	execute(message, args) {
		//	Obviously uses tapmusic haha
		//	Weekly is a default
		let option = '7day';
		let has_options = 1;
		if (args[0] === '--m' || args[0] === '--month') {
			option = '1month';
		}
		else if (args[0] === '--3m' || args[0] === '--3month') {
			option = '3month';
		}
		else if (args[0] === '--6m' || args[0] === '--6month') {
			option = '6month';
		}
		else if (args[0] === '--y' || args[0] === '--year') {
			option = '12month';
		}
		else if (args[0] === '--o' || args[0] === '--overall') {
			option = 'overall';
		}
		else {
			has_options = 0;
		}
		message.channel.send('Chart for ' + args[(0 + has_options)], {
			file:('http://tapmusic.net/collage.php?user=' + args[(0 + has_options)] + '&type=' + option + '&size=5x5&caption=true'),
		});
	},
};