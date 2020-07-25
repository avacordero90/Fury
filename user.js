const fs = require('fs');



class User {
	constructor (user) {

		if (this.isUser(user)) {
			var obj = this.getUser(user);
			
			this.id = obj.id;
			this.tag = obj.tag;
			this.name = obj.username;
			this.avatar = obj.avatarURL;

			if (obj.interviews != undefined) {
				this.interviews = obj.interviews;
				this.activeInterview = obj.activeInterview
			} else {
				this.interviews = {};
				this.activeInterview = -1
			}

		} else {
			this.id = user.id;
			this.tag = user.tag;
			this.name = user.username;
			this.avatar = user.avatarURL;
			
			if (user.interviews != undefined) {
				this.interviews = user.interviews;
				this.activeInterview = user.activeInterview;
			} else {
				this.interviews = {};
				this.activeInterview = -1
			}

			this.setUser();
		}	
	}

	addInterview (server, channel) {
		this.interviews[server.id] = channel.id;
		this.setUser();
	}

	setUser () {
		var json = JSON.stringify(this);
		fs.writeFileSync(`users/${this.id}.json`, json, 'utf8', (err) => {
			if (err){
				util.log(err);
			}
		});
	}

	getUser (user) {
		var data = fs.readFileSync(`users/${user.id}.json`, 'utf8', (err) => {
			if (err)
				util.log(err);
		});
		if (data) {
			// log(data);
			return JSON.parse(data); //now it's an object
		} else log("User not found.");
	}

	// isUser () {
	// 	try {
	// 		// if channels with this.id and this.logCategory exist
			
	// 		// util.log(guild.id);

	// 		if (this.isUserFile()) {
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

	isUser (user) {
		try {
			if (fs.existsSync(`users/${user.id}.json`))
				return true;
			else
				return false;
		} catch (err) {
			util.log(err);
			return false;
		}
	}

	// static isUser (guild, user) {
	// 	try {
	// 		var file = this.isUserFile(user);

	// 		// util.log(user.interviews[guild.id]);

	// 		// if channel with this.id and this.logCategory exist
	// 		if (file && guild.channels.cache.get(user.interviews[guild.id])) {
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

	// static isUserFile (user) {
	// 	try {
	// 		if (fs.existsSync(`users/${user.id}.json`))
	// 			return true;
	// 		else
	// 			return false;
	// 	} catch (err) {
	// 		util.log(err);
	// 	}
	// }

	// isUserFile () {
	// 	try {
	// 		if (fs.existsSync(`users/${this.id}.json`))
	// 			return true;
	// 		else
	// 			return false;
	// 	} catch (err) {
	// 		util.log(err);
	// 	}
	// }


	loadUser (sender) {
		try {
			// if user does exists
			if (isUser(sender)) {
				// load user from file
				var user = getUser(sender);
				user = new User(user);
				// log(JSON.stringify(user));
			} else {
				// else create user and save to file
				var user = new User(sender);
				setUser(user);
			}

			if (user)
				return user;
		} catch (err) {
			util.log(err)
		}
	}

	// getMsgUser (msg) {
	// 	var author = msg.author;
	// 	// if user does exists
	// 	if (isUser(author)) {
	// 		// load user from file
	// 		var user = loadUser(author);
	// 	} else {
	// 		// else create user and save to file
	// 		var user = new User(author);
	// 		setUser(user);
	// 	}

	// 	return user;
	// }

	// getMsgUserNick (msg) {
	// 	return msg.member.nickname;
	// }

}


module.exports = User;