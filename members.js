/*
	members
		by Luna
		Created: 12/21/2019
		Latest: 7/25/2020
		Description: Backs up members of a server and restores the backup by sending invites to the backup list.
*/

/*
	TODO
		test storing discordjs objects
*/


const { RichEmbed } = require('discord.js');
const fs = require('fs');

const util = require("./util.js");
const auth = require('./auth.json');

var guilds = {};

	
function backupFileCreate (guild, memberInfo) {
	// The absolute path of the new file with its name
	var filepath = `backups/${guild.name}_${guild.id}.txt`;

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

exports.backupCreate = function backupCreate (msg) {

	//create backup
	util.reply(msg, "Fury", "creating backup...");
	util.log("creating backup...");

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

	// create member file
	var memberInfo = "Member Tag\t\tMember ID\n";

	// for each guild member
	for (const [key, value] of msg.guild.members.cache)
		// if they're not a bot
		if (!value.user.bot)
			// record their tag and id
			memberInfo += `${value.user.tag}\t\t${value.user.id}\n`
	
	// create the backup file
	var backupFile = backupFileCreate(msg, memberInfo);

	// add the guild to the guild dict
	guilds[msg.guild.id] = msg.guild;
	util.log(guilds[msg.guild.id]);

	util.replyDM(msg, "Fury", `${msg.guild.name} member list has been backed up! see attached file. Run this command to restore your backup: ` + `<prefix> backup restore -n ${msg.guild.id}`, null, backupFile);

	// Send the embed to the user
	util.reply(msg, "Fury", "Check your DMs! You have been sent a message with the member list and a backup file.");
}

exports.backupRebuild = function backupRebuild (guild) {
	//create backup
    util.log(`rebuilding backup for server ${guild[1].id}...`);

	// create member file
	// var memberInfo = "Member Tag\t\tMember ID\n";

	// for each guild member
	// for (const [key, value] of guild.fetch().then(g => {
	// 	// record their tag and id
	// 	memberInfo += `${value.user.tag}\t\t${value.user.id}\n`;
	// }))

	// members = guild[1].members.cache;
	// util.log(JSON.stringify(members));

	// // util.log(JSON.stringify(guild));
	// // for each guild member
	// for (const member of guild[1].members) {
	// 	// record their tag and id
	// 	memberInfo += `${member.user.tag}\t\t${member.user.id}\n`;
	// 	util.log(JSON.stringify(member));
	// }

	// // // create the backup file
	// var backupFile = backupFileCreate(guild, memberInfo);

	// add the guild to the guild dict
	guilds[guild[1].id] = guild[1];
	
	util.log("backup rebuild complete.");
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
					members.forEach(member => {
						if (!member.user.bot)
							member.send(
								`${msg.guild.name} has been restored using Fury! Here's the invite link!\n${invite.url}`
							)
					});
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