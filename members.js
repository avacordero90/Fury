/*
	members
		by Luna
		Created: 12/21/2019
		Latest: 7/25/2020
		Description: Backs up guild members of a group and restores the backup by sending invites to the backup list.
*/

/*
	TODO
		
*/


const { RichEmbed } = require('discord.js');
const fs = require('fs');

const util = require("./util.js");
const auth = require('./auth.json');

var guilds = {};

exports.backupCreate = function backupCreate (msg) {
    util.log("creating backup...");
    util.reply(msg, "Fury", "creating backup...");

	// Validate for administrator and server.
	if (msg.member == null) {
		util.log("Not in a server.");
		util.reply(msg, "Fury", "This command must be run in a server channel.")
		return;
	} else util.log("Server.");
	if (!msg.member.hasPermission(8)) {
		util.log("Not an admin.");
		util.reply(msg, "Fury", "Only an admin may run this command.")
		return;
	} else util.log("Admin.");

	var memberInfo = "Member Tag\t\tMember ID\n";

	// for each guild member
	for (const [key, value] of msg.guild.members.cache)
		// record their tag and id
		if (!value.user.bot) memberInfo += `${value.user.tag}\t\t${value.user.id}\n`
	
	// create the backup file
	var backupFile = backupFileCreate(msg, memberInfo);

	// add the guild to the guild dict
	guilds[msg.guild.id] = msg.guild;
	util.log(guilds[msg.guild.id]);

	// Send the embed to the user
	util.replyDM(msg, "Fury", `${msg.guild.name} member list has been backed up! see attached file. Run this command to restore your backup: ` + `<prefix> backup restore -n ${msg.guild.id}`, null, backupFile);
	util.reply(msg, "Fury", "Check your DMs! You have been sent a message with the member list and a backup file.");
}

function backupFileCreate (msg, memberInfo) {
	// The absolute path of the new file with its name
	var filepath = `backups/${msg.guild.name}_${msg.guild.id}.txt`;

	try {
		fs.writeFile(filepath, memberInfo, (err) => {
			if (err) throw err;

			util.log("The file was succesfully saved!");
		});
	} catch (error) {
		util.log(error)
	}

	return filepath;
}

exports.backupRestore = function backupRestore (msg, guild = msg.guild.id) {
	// Validate for administrator and server.
	if (msg.member == null) {
		util.log("Not in a server.");
		util.reply("This command must be run in a server channel.")
		return;
	} else util.log("Server.");
	if (!msg.member.hasPermission(8)) {
		util.log("Not an admin.");
		util.reply("Only an admin may run this command.")
		return;
	} else util.log("Admin.");
	if (guilds[guild])
		var members = guilds[guild].members.cache;
	// util.log(members);
	if (members) {
		const invite = msg.channel.createInvite()
			.then(invite =>	{
				util.log(`Created an invite with a code of ${invite.code}`);
				try {
					members.forEach(element => element.send(
						`${msg.guild.name} has been restored using Fury! Here's the invite link!\n${invite.url}`
					));
				} catch (error) {
					util.log(error);
				}

			})
			.catch(console.error);
	} else {
		// Send the embed to the same channel as the message
		util.reply(msg, "Fury", "No backup exists!");
	}
	return;
}