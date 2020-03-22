/*
	util.js
		atr0phy
		created: 1/2/2020
		latest: 1/11/2020
		version: 1.2
*/



const Discord = require("discord.js");
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');

const User = require("./user.js");
const Server = require("./server.js");



function time () {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return date+' '+time;
}

function log (logMsg) {
	try {
		var filePath = `bot.log`;
		var fullMsg = `${time()} : ${logMsg}`;

		console.log(fullMsg);
		// The absolute path of the new file with its name
		fs.access(filePath, fs.F_OK, (err) => {
			if (err) {
				console.error(err);
				fs.writeFileSync(filePath, `${fullMsg}\n`, (err) =>{
					if (err) {
						console.log(err);
					}
				})
			} else {
				fs.appendFileSync(filePath, `${fullMsg}\n`, (err) => {
					if (err) {
						console.error(err);
					}
				});
			}
		});
	} catch (err) {
		console.log(err);
	}
}

function reply (msg, title, reply, avatar = null) {
	try {
	    if (avatar) {
		    var embed = new MessageEmbed()
				// Set the avatar
				.setImage(avatar)
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0xc2261f)
				//	 Set the main content of the embed
				.setDescription(reply);
		} else {
		    var embed = new MessageEmbed()
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0xc2261f)
				//	 Set the main content of the embed
				.setDescription(reply);		
		}
		// Send the embed to the same channel as the message
		msg.channel.send(embed);
	} catch (err) {
		log(err);
	}
}

function replyDM (msg, title, reply, avatar = null) {
	try {
	    if (avatar) {
		    var embed = new MessageEmbed()
				// Set the avatar
				.setImage(avatar)
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0xc2261f)
				//	 Set the main content of the embed
				.setDescription(reply);
		} else {
		    var embed = new MessageEmbed()
				// Set the title of the field
				.setTitle(title)
				// Set the color of the embed
				.setColor(0xc2261f)
				//	 Set the main content of the embed
				.setDescription(reply);		
		}
		// Send the embed to the same channel as the message
		msg.author.send(embed);
	} catch (err) {
		log(err);
	}
}


module.exports = {
    log: log,
    reply: reply,
    replyDM: replyDM,
};