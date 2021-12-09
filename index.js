require('dotenv').config();

const tmi = require('tmi.js');
const moment = require('moment');

const sheet = require('./lib/sheet');
const colors = require('./lib/colors');

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: 'mercwnzBOT',
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: [
		'mercwnz',
		'pnkyfish'
	]
});

console.log("Connect to IRC");
client.connect();
client.on('message', (channel, tags, message, self) => {

	if(self) return;

	if(
		(tags.username === 'pnkyfish')
		|| (tags.username === 'mercwnz')
		|| (tags.username === 'streamelements')
	){

		uptime = message.match(/has been streaming for (\d+) hours (\d+) mins/i);

		if(uptime){

			let t = moment.duration(uptime[1].padStart(2, '0')+":"+uptime[2].padStart(2, '0')+":00");
			let ss = moment().subtract(t).format("HH:mm:ss");

			console.log(colors.fg.green, "Stream Start updated\t", colors.reset, ss);

			sheet.updateWithValues([
				{
					range: "Variables!B2",//STREAM_START
					values: [
						[
							ss
						]
					]
				}
			]);
		}

		die = message.match(/pnkyfish just died again. She has now died (\d+) times/i);

		if(die){

			console.log(colors.fg.red, "Die update\t", colors.reset, die[1]);

			sheet.appendWithValue(
				"Deaths!A:A",
				[
					[
						moment().unix(),
						moment().format("YYYY-MM-DD HH:mm:ss")
					]
				]
			);

			setTimeout(() => {
				sheet.getCell(client, "Phrases!A1",{
					"command" : "say",
					"channel" : channel
				})
			}, 2000);
		}

		mpd = message.match(/^!mpd (\d+) (\d+)/i); //!mpd timeLimit target

		if(mpd){

			console.log(colors.fg.cyan, "MpD sheet updated\t", colors.reset, mpd[0]);

			sheet.updateWithValues([
				{
					range: "Variables!B3",//PREDICTION_START
					values: [
						[
							moment().unix()
						]
					]
				},
				{
					range: "Variables!B10",//PREDICTION_TIMELIMIT
					values: [
						[
							mpd[1]
						]
					]
				},	
				{
					range: "Variables!B8",//PREDICTION_DEATHS_TARGET
					values: [
						[
							mpd[2]
						]
					]
				},

			]);

			client.say(channel, "MpD sheet updated!");
			
			/*
				start timer and toggle tracking
			*/
		}

		/*
			if mpd target matched
			of if timer finished
				say to channel
				and stop tracking
		*/

	}

	deaths = message.match(/^!deaths$/);

	if(deaths){

		console.log(colors.fg.green, "!deaths command triggered by\t", colors.reset, tags.username);

		setTimeout(() => {
			sheet.getCell(
				client,
				"Phrases!A3",{
					"command" : "say",
					"channel" : channel
				}
			)
		}, 2000);
	}

	life = message.match(/^!life$/);

	if(life){

		console.log(colors.fg.green, "!life command triggered by\t", colors.reset, tags.username);

		setTimeout(() => {
			sheet.getCell(
				client,
				"Phrases!A2",{
					"command" : "say",
					"channel" : channel
				}
			)
		}, 2000);
	}

	mpd = message.match(/^!mpd$/);

	if(mpd){

		console.log(colors.fg.green, "!mpd command triggered by\t", colors.reset, tags.username);

		setTimeout(() => {
			sheet.getCell(
				client,
				"Phrases!A5",{
					"command" : "say",
					"channel" : channel
				}
			)
		}, 2000);
	}

	left = message.match(/^!left$/);

	if(left){

		console.log(colors.fg.green, "!left command triggered by\t", colors.reset, tags.username);

		setTimeout(() => {
			sheet.getCell(
				client,
				"Phrases!A4",{
					"command" : "say",
					"channel" : channel
				}
			)
		}, 2000);
	}

});