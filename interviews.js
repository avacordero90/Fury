



const { RichEmbed } = require('discord.js');
const fs = require('fs');

const User = require("./user.js");
const Server = require("./server.js");

const util = require("./util.js");


let intMsg = "Thank you for using Fury Emissary! Your interview will begin as soon as a Mod or Admin has become available. Thank you for your patience!"


exports.setup = async function setup (msg) {
	const server = new Server(msg.guild);

	const category = await getLogCategory(msg.guild, server);

	// if (server.logCategory != -1) {
	if (server.logCategory != -1 && category != undefined) {
		util.reply(msg, "Fury Emissary", "Setup has been previously completed.")
		// server = getMsgServer(msg);
	} else {
		createLogChannel(msg);
		// server = getMsgServer(msg);
		util.reply(msg, "Fury Emissary", "Setup complete.")
	// }		
	}
}

exports.start = async function start (msg) {
	// if server has not been setup yet
	const server = new Server(msg.guild);
	const user = new User(msg.author);
	
	// util.log(server.logCategory);
	// util.log(JSON.stringify(user.interviews));

	const channel = await getInterviewChannel(msg.guild, user);

	if (server.logCategory == -1) {
		util.reply(msg, "Fury Emissary", "Emissary has not been set up on this server yet.")
	} else if (server.id in user.interviews && channel != undefined) {
		if (channel.deleted) {
			startInterview(msg);
			// sendQuestion(server, msg);
		} else
			util.reply(msg, "Fury Emissary", "Interview has already been started.");
	} else {
		startInterview(msg);
		// sendQuestion(server, msg);
	}
}

exports.sendAnswer = function sendAnswer(user, msg) {
	// if sender has more than one interview
	if (user.interviews.length > 1) {
		// send embed with reacts to choose the right server
		// while loop until server is chosen	
		// send message to server at user's interview channel
		// update user's ACTIVE INTERVIEW to that server
			// until f.switch command OR interview closed. <-- CONTINUE HERE !!!
	}
	// else if sender has only one interview
		//send message to server at user's interview channel

	sendAnswerMsg(user, msg);
}

async function sendAnswerMsg (user, msg) {
	// try {
	    const embed = new MessageEmbed()
			// Set the title of the field
			.setTitle("Emissary")
			// Set the color of the embedconst
			.setColor(0xc2261f)
			//	 Set the main content of the embed
			.setDescription(msg.content);

		// CONTINUE HERE

		const channel = await getInterviewChannelDM();

		// Send the embed to the user's interview channel
		channel.send(embed);
	// } catch (err) {
	// 	util.log(err);
	// }
}

function sendQuestion(server, msg) {
	// do stuff here

	// util.replyDM (msg, "title", "reply")

	sendQuestionMsg(server, msg);
}

async function sendQuestionMsg (server, msg) {
	// try {
	    const embed = new MessageEmbed()
			// Set the title of the field
			.setTitle("Emissary")
			// Set the color of the embed
			.setColor(0xc2261f)
			//	 Set the main content of the embed
			.setDescription(msg.content);

		// get the user's id from server.users[msg.channel.id]
		if (server.users[msg.channel.id]) {
			const userId = server.users[msg.channel.id];

			// get the Discord user object by its ID
			const user = await getDUser(msg.guild, userId);

			// Send the embed to the user's DMs
			user.send(embed);
		}
		
	// } catch (err) {
	// 	util.log(err);
	// }
}

function getDUser (guild, userId) {
	
	return new Promise(resolve => {
		return resolve(guild.members.cache.get(userId));
	});
}

function switchServer(msg) {
	// do stuff.
	util.log("switchServer() not yet implemented.");
}

function createLogCategory (msg) {
	// try {
		const id = msg.guild.id;
		const channels = msg.guild.channels;
		
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
		const id = msg.guild.id;
		const channels = msg.guild.channels;
		const server = new Server(msg.guild);

		const category = await createLogCategory(msg);

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

function getInterviewChannel (guild, user) {
	return new Promise(resolve => {
		return resolve(guild.channels.cache.get(user.interviews[guild.id]));
	});
}

function getInterviewChannelDM () {
	return new Promise(resolve => {
		return resolve();
	});
}

function startInterview (msg) {
	try {
		// var user = new User(msg.author);
		const name = msg.member.displayName;

		// create user's interview channel
		createInterview(msg);
		
		// reply to user
		util.replyDM(msg, "Emissary", intMsg);
		util.reply(msg, "Emissary", `${name} is ready to begin interview. Please check your DMs.`);
	} catch (ex) {
		util.log(ex);
	}
}

function getLogCategory (guild, server) {
	return new Promise(resolve => {
		return resolve(guild.channels.cache.get(server.logCategory));
	});
}

function createUserChannel (msg, category) {
	const server = new Server(msg.guild);
	const user = new User(msg.author);

	const channels = msg.guild.channels;

	return new Promise(resolve => {
		return resolve(channels.create(user.tag, {
			type: 'text',
			parent: category,
			permissionOverwrites: [{
				id: server.id,
				deny: ['VIEW_CHANNEL']
			}]
		})
		);
	});
}

async function createInterview (msg) {
	const server = new Server(msg.guild);
	const user = new User(msg.author);

	const channels = msg.guild.channels;

	// const category = await channels.cache.get(server.logCategory);
	const category = await getLogCategory(msg.guild, server);

	const userChannel = await createUserChannel(msg, category)

	user.addInterview(server, userChannel);

	server.addUser(user, userChannel);
}