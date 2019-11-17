//	Image search and stuff.
//	2019 Daniel Hannon
//	Uses Pixabay API
//	And Unirest lol
const Search = require('unirest');
const { image_token } = require("../config.json");

module.exports = {
	name: 'img',
	description: 'Image Search using pixabay',
	execute(message, args) {
		let query = '';
		let arg = 0;
		if (args.length > 0) {
			for (arg in args) {
				query = query + args[arg] + '+';
			}
			query = query.slice(0, -1);
		}
		else {
			query = args[0];
		}
		console.log('Starting Image Search for topic: ' + query);
		const img_query = Search("GET", ("https://pixabay.com/api/?key=" + image_token));
		img_query.query({
			"q" : query,
		});
		img_query.end(function(res) {
			//	Gets a random image for fun lol
			try {
				const results = JSON.parse(res.raw_body);
				const randval = Math.floor(Math.random() * (results.hits.length - 1) + 0.5);
				message.channel.send('Found ' + results.hits.length + ' Images Courtesy of pixabay, here\'s a random one!', {
					file :(results.hits[randval].webformatURL),
				});
				console.log(results.hits[randval].webformatURL);
			}
			//	Hopefully this works hahahaha
			//	It crashes when there's no results so here's to hoping!
			catch (error) {
				message.channel.send("No results!");
			}
			return;
		});
	},
};