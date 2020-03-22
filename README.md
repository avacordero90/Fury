# fury ~by Luna

## A useful multipurpose bot

### features:
	1. substitutions
		A. just like ragebot from kik
	2. bans
		A. admin can ban
			1. from current server OR
			2. from any other server they share with the admin *
		B. can auto ban known creeps from a user's shared ban database
	3. track member activity/inactivity
		A. can auto kick members
			1. after x time OR
			2. above y members
		B. can white list user if they will be auth'ed inactive
	4. perform admin interviews
		A. user side
			1. user tags @fury to begin the interview
			2. fury DMs the user and already knows which server they came from.
			3. gives the user a custom prefix for each ->open<- server ticket, unless none is needed. (eg. f.1 OR f.2) **
				a. user replies to DM using custom prefix if needed.
		B. admin side
			1. creates channels to respond the same as modmail
			2. defaults to anonymous replies (option to de-anonymize?)
			3 can be configured to:
				a. on verify
					1. generate main server invite link and send to user *
				b. on join main server
					1. close ticket *
					2. kick user from verify server *
	5. configurable from online dashboard?
* IF DISCORD API ALLOWS THIS
** RESEARCH NEEDED

## Usage:

	default prefix: f.

	f.help : DMs you the help menu
	f.start : begin your journey!
