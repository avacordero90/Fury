/*
	bot.js - Fury
		by Luna
		created: 1/2/2020
		latest: 7/25/2020
		version: 1.3
*/


const Discord = require("discord.js");
const MessageEmbed = require("discord.js").MessageEmbed;

const client = new Discord.Client();
const fs = require("fs");

const User = require("./user.js");
const Server = require("./server.js");

const util = require("./util.js");
const members = require("./members.js");
const interviews = require("./interviews.js");

const auth = require("./auth.json");


let pre = "f!"


function procCommand (msg) {
	try {
		if (!msg.author.bot) {
			// if it's a guild channel (message must start with global prefix.)
			const isCmd = msg.content.startsWith(pre);
			// const isAdm = msg.member.hasPermission("ADMINISTRATOR");
			const isDM = msg.guild == null;

			let message = msg.content.toLowerCase();
			util.log(`received command '${message}' from user '${msg.author.id}'.`);

			if (isCmd) {
				const cmd = message.replace(pre,"").replace(/^\s+|\s+$/g, '');//.split(" ");

				if (cmd == "help")
					help(msg);

				if (!isDM) {
					// process commands
					if (cmd == "interview setup" && msg.member.hasPermission('ADMINISTRATOR'))
						interviews.setup(msg);
					else if (cmd == "interview start")
						interviews.start(msg);
					else if (cmd == "backup create") {
						members.backupCreate(msg);
					}
					if (cmd.startsWith("backup restore -n ")) {
						guildName = cmd.split(" ").splice(3).join(" ");
						util.log(guildName);
						msg.channel.send("restoring " + guildName + " from backup...");
						members.backupRestore(msg, guildName);
					}
				} else if (isDM) {
					if (cmd == "switch")
						switchServer(msg);
				}
			} else if (isDM) { // !isCmd is implied
				const user = new User(msg.author)
				interviews.sendAnswer(user, msg);
				util.log ("isDM: " + isDM);
			} else if (msg.member.hasPermission('ADMINISTRATOR')) { // else if user is admin (!isDM is implied)
				const server = new Server(msg.guild);
				// if channel id is equal to the server's a list of users
				interviews.sendQuestion(server, msg);
			}
		}
	} catch (err) {
		util.log(err);
	}
}

/*
	Function 	: parseArgs
	Accepts		: message
	Returns		: argument string array
	Process		: slices up message content into standard args list
*/
function parseArgs (message) {
	// if (args.length > 2) {
		let args = message.split(pre);
		args = args[1].split(" ");
		if (args[0] == "")
			args = args.slice(1,args.length);
	// }

	return args
}

/*
	Function 	: help
	Accepts		: message
	Returns		: nothing
	Process		: DMs the user with the contents of README.md.
*/
function help (msg) {
	const name = msg.member.cache.displayName;

	const data = fs.readFileSync(`usage.txt`, 'utf8', (err) => {
		if (err)
			util.log(err);
	});
	if (data) {
		// log(data);
		util.reply(msg, "Fury", `${name}, the help menu has been sent to your DMs`)
		util.replyDM(msg, "Fury", data)
	} else util.log("==> Error: Help file not found.");
}

client.on("ready", () => {
  util.log(`logged in as ${client.user.tag}.`);
});

client.on("message", msg => {
	procCommand(msg);
});

client.login(auth.token);
