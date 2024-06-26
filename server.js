const fs = require('fs');

const User = require("./user.js");

const util = require("./util.js");



class Server {

	constructor (guild) {

		if (this.isServer(guild)) {
		// if server file exists
			// get its json data and cast to a Server
			var obj = this.getServer(guild);
			
			this.id = obj.id;
			this.logCategory = obj.logCategory;
			this.users = obj.users;
		} else {
		// if server file doesn't exist
			// construct default Server
			this.id = guild.id;
			this.logCategory = -1
			this.users = {};
			
			this.setServer();
		}

	}

	isServer (guild) {
		try {
			if (fs.existsSync(`servers/${guild.id}.json`)) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			util.log(err);
			return false;
		}
	}

	setLogCategory (guild, category){
		this.logCategory = category.id;
		this.setServer(guild);
	}

	// getLogCategory () {
	// 	return this.logCategory;
	// }

	addUser (user, channel) {
		this.users[channel.id] = user.id;
		this.setServer();
	}

	setServer () {
		var json = JSON.stringify(this);
		fs.writeFileSync(`servers/${this.id}.json`, json, 'utf8', (err) => {
			if (err){
				util.log(err);
			}
		});
	}

	getServer (guild) {
		try {
			var data = fs.readFileSync(`servers/${guild.id}.json`, 'utf8', (err) => {
				if (err)
					util.log(err);
			});
			if (data)
				// util.log(data);
				return JSON.parse(data); //now it's an object
		} catch (err) {
			util.log(err);
			util.log("Server not found.");
		}
	}

	// loadServer () {
	// 	// try {
	// 		// if server does exists
	// 		if (this.isServerFile()) {
	// 			// // load server from file
	// 			var server = this.getServer();
	// 			server = new Server(server);
	// 			// util.log("pre-existing: " + JSON.stringify(server));
	// 		} else {
	// 			// else create server and save to file
	// 			var server = new Server(this);
	// 			this.setServer();
	// 			// util.log("new: " + JSON.stringify(server));
	// 		}

	// 		// util.log(JSON.stringify(server));

	// 		if (server)
	// 			return server;
	// 	// } catch (err) {
	// 	// 	util.log(err)
	// 	// }
	// }

}


module.exports = Server;