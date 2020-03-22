/*
	bot.js
		atr0phy
		created: 1/2/2020
		latest: 1/11/2020
		version: 1.2
*/


const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const User = require("./user.js");
const Server = require("./server.js");

const util = require("./util.js");
const auth = require("./auth.json");



var pre = "f."
var intMsg = "Thank you for using Fury Emissary! Your interview will begin as soon as a Mod or Admin has become available. Thank you for your patience!"

function procCommand (msg) {
	// try {
		if (!msg.author.bot) {
			
			// if it's a guild channel (message must start with global prefix.)
			var isCmd = msg.content.startsWith(pre);

			if (isCmd) {

				if (msg.channel.guild) {

					var args = parseArgs(msg);
					var cmd = args[0];
					var isAdm = msg.member.hasPermission("ADMINISTRATOR");

					// process commands
					if (cmd == "help")
						help(msg);
					else if (cmd == "setup" && isAdm)
						setup(msg);
					else if (["start", "interview"].includes(cmd))
						startInterview(msg);

				} else if (msg.channel.client) {

					// TO DO: CONTINUE CODING HERE !!!

				}
			}
		}
	// } catch (err) {
	// 	util.log(err);
	// }
}

/*
	Function 	: parseArgs
	Accepts		: message
	Returns		: argument string array
	Process		: slices up message content into standard args list
*/
function parseArgs (msg) {
	var args = msg.content.toLowerCase().split(pre)[1].split(" ");
	if (args[0] == "") args = args.slice(1,args.length);
	util.log(`received command '${args}' from user '${msg.author.id}'.`)
	return args
}

/*
	Function 	: help
	Accepts		: message
	Returns		: nothing
	Process		: DMs the user with the contents of README.md.
*/
function help (msg) {

	var nick = util.getMsgUserNick(msg);


	var data = fs.readFileSync(`usage.txt`, 'utf8', (err) => {
		if (err)
			util.log(err);
	});
	if (data) {
		// log(data);
		util.reply(msg, "Fury", `${nick}, the help menu has been sent to your DMs`)
		util.replyDM(msg, "Fury", data)
	} else util.log("==> Error: Help file not found.");
}

async function setup (msg) {
	var server = new Server(msg.guild);
	if (server.logCategory != -1) {
		var server = new Server(msg.guild);
		util.reply(msg, "Fury", "Setup has been previously completed.")
		// server = getMsgServer(msg);
	} else {
		createLogChannel(msg);
		// server = getMsgServer(msg);
		util.reply(msg, "Fury", "Setup complete.")
	// }		
	}

}

function createLogCategory (msg) {
	// try {
		var id = msg.guild.id;
		var channels = msg.guild.channels;
		
		return new Promise(createCategory => {
			createCategory(
				channels.create('Fury Emissary', {
					type: 'category',
					permissionOverwrites: [{
						id: id,
						deny: ['VIEW_CHANNEL']
					}]
				})
			);
		});

	// } catch (ex) {
	// 	util.log(ex);
	// }
}

async function createLogChannel (msg) {
	// try {
		var id = msg.guild.id;
		var channels = msg.guild.channels;
		var server = new Server(msg.guild);

		var category = await createLogCategory(msg);

		// util.log(category.id);

		server.setLogCategory(msg.guild, category);

		channels.create('Emissary Logs', {
			type: 'text',
			parent: category,
			permissionOverwrites: [{
				id: id,
				deny: ['VIEW_CHANNEL']
			}]
		});

	// } catch (ex) {
	// 	util.log(ex);
	// }
}

function startInterview (msg) {
	// if server has not been setup yet
	var server = new Server(msg.guild);

	// util.log(server.logCategory);

	if (server.logCategory == -1) {
		util.reply(msg, "Emissary", "Emissary has not been set up on this server yet.")
	} else if (User.isUser(msg.guild, msg.author)) {
		util.reply(msg, "Emissary", "Interview has already been started.")
	} else {
		try {
			var user = new User(msg.author);
			var nick = msg.member.nickname;

			// create user's interview channel
			createUserChannel(msg);
			
			// reply to user
			util.replyDM(msg, "Emissary", intMsg);
			util.reply(msg, "Emissary", `${nick} is ready to begin interview. Please check your DMs.`);
		} catch (ex) {
			util.log(ex);
		}
	}
}

// BEGIN BUGGY SECTION

function getLogCategory(msg, server) {
	return new Promise(resolve => {

		return resolve(msg.guild.channels.cache.get(server.logCategory));
	});
}

async function createUserChannel (msg) {
	var channels = msg.guild.channels;
	var guildId = msg.guild.id;
	var user = new User(msg.author);
	var server = new Server(msg.guild);

	// var category = await channels.cache.get(server.logCategory);
	var category = await getLogCategory(msg, server); // <-- BUG SHOWS ITS UGLY FACE HERE

	user.addInterview(guildId, category.id);
	
	channels.create(user.tag, {
		type: 'text',
		parent: category,
		permissionOverwrites: [{
			id: guildId,
			deny: ['VIEW_CHANNEL']
		}]
	});

}

// END BUGGY SECTION 


client.on("ready", () => {
  util.log(`logged in as ${client.user.tag}.`);
});

client.on("message", msg => {
	procCommand(msg);
});

client.login(auth.token);
