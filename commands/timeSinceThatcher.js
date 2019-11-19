module.exports = {
    name: 'timeSinceThatcher',
    description: 'prints days since thatcher\'s death in days, and an image of her grave',
    
execute(message, args) {
let timeOfDeath = Date.parse('2013/04/08');
let timeNow = Date.now();
const difference = timeNow -  timeOfDeath;
let numOfDays = 0;

if (args[0] == "--thatcher") {
    numOfDays = Math.floor(difference / 8.64e+7);
    message.channel.send("It has been" +numOfDays+ "days since Thatcher has died");
    Channel.send("Here's a picture of Thatcher's grave", {files: ["https://upload.wikimedia.org/wikipedia/commons/e/e3/MTgrave2.jpeg"]});
}
    },
};

