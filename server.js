const fs = require('fs');

const util = require("./util.js");



class Server {

	constructor (guild) {

		// if a Discord guild was passed


		// YOU DUMBASS IT'S ALWAYS GOING TO BE A GUILD PASSED

		if (this.isServer(guild)) {
		// if server file exists
			// get its json data and cast to a Server
			var obj = this.getServer(guild);
			
			this.id = obj.id;
			this.logCategory = obj.logCategory;
		} else {
		// if server file doesn't exist
			// construct default Server
			this.id = guild.id;
			this.logCategory = -1
			
			this.setServer(guild);
		}



		// if (guild.logCategory == undefined) {
		// 	this.id = guild.id;
		// 	this.logCategory = -1
			
		// 	this.setServer();
		// } else {
		// 	if (this.isServer(guild)) {
		// 	// if server file exists
		// 		// get its json data and cast to a Server
		// 		var obj = this.getServer();
				
		// 		this.id = obj.id;
		// 		this.logCategory = obj.logCategory;
		// 	} else {
		// 	// if server file doesn't exist
		// 		// construct default Server
		// 		this.id = guild.id;
		// 		this.logCategory = -1
				
		// 		this.setServer();
		// 	}
		// }
	















		// if (guild.logCategory == undefined) {
		// 	this.id = guild.id;
		// 	this.logCategory = -1
		// }  else if (this.logCategory == -1) {
		// 	util.log("false1");

		// 	this.id = guild.id;
		// 	this.logCategory = guild.logCategory;

		// 	this.setServer();
		// } else if (guild.logCategory != undefined) {
		// 	// util.log("true");
			
		// 	var obj = this.getServer();
			
		// 	this.id = obj.id;
		// 	this.logCategory = obj.logCategory;

		// 	// this.setServer();
		// }
	}

	// isServer () {
	// 	try {
	// 		// if channels with this.id and this.logCategory exist
			
	// 		// util.log(guild.id);

	// 		if (this.isServerFile()) {
	// 			// true
	// 			return true;
	// 		// otherwise
	// 		} else {
	// 			//false
	// 			return false;
	// 		}
	// 	} catch (err) {
	// 		util.log(err);
	// 	}
	// }

	// // only used privately but #isServerFile gives error:
	// // SyntaxError: Unexpected token '('
	// isServerFile () {
	// 	try {
	// 		if (fs.existsSync(`servers/${this.id}.json`))
	// 			return true;
	// 		else
	// 			return false;
	// 	} catch (err) {
	// 		util.log(err);
	// 	}
	// }

	// static isServer () {
	// 	try {
	// 		// if channels with this.id and this.logCategory exist
			
	// 		// util.log(guild.id);

	// 		if (this.isServerFile()) {
	// 			// true
	// 			return true;
	// 		// otherwise
	// 		} else {
	// 			//false
	// 			return false;
	// 		}
	// 	} catch (err) {
	// 		util.log(err);
	// 	}
	// }

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

	setServer (guild) {
		var json = JSON.stringify(this);
		fs.writeFileSync(`servers/${guild.id}.json`, json, 'utf8', (err) => {
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