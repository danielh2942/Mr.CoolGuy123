# Mr.CoolGuy123
Babys first discord bot

Requires Discord.js and whatever else is in the npm manifest


Manifest

Basically Mr.CoolGuy123 is a very easily extendable discord bot
In order to add a feature to the bot just add a command to the commands folder
and update package-lock.json and such if needs be too!

Here is the convention for a command
```node
module.exports = {
	name : 'function_name'
	description: 'description of function'
	execute(message, args) {
		// Commands to be executed by user
	},
	checker(client, channel, extra) {
		// Scheduled commands (CronJobs)
	}
};
```

eventually there will be some form of automated moderation system with the bot and until then the above is the current scheme
filenames must be one word, lowercase and the same as the name value in module.exports

thank you and good luck

if you add additional node libraries just please run through 

```bash
npm init
```

to update package.json and the like

also you need your own config.json file to run it. cheers!