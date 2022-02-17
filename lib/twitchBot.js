require('dotenv').config();

const sheet = require('./googleSheet');
const colors = require('./colors');

const moment = require('moment');
const tmi = require('tmi.js');

const twitchBot = new tmi.Client({
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
twitchBot.connect();
twitchBot.on('message', (channel, tags, message, self) => {

	if(self) return;

	if(
		(tags.username === 'pnkyfish')
		|| (tags.username === 'mercwnz')
		|| (tags.username === 'streamelements')
	){

		fish = message.match(/15 Seconds. Enter by typing \"!fish\" FeelsGoodMan$/i);
		
		if(fish){
			setTimeout(() => {
				twitchBot.say(channel,"!fish")
			}, 2000);
		}

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

			sheet.updateWithValues([
				{
					range: "Variables!B4",//STREAM_START
					values: [
						[
							moment().unix()
						]
					]
				}
			]);

			setTimeout(() => {
				sheet.getCell(twitchBot, "Phrases!A1",{
					"command" : "say",
					"channel" : channel
				})
			}, 2000);
		}

		start = message.match(/^!start$/i);

		if(start){

			console.log(colors.fg.green, "Approx Stream Start updated\t", colors.reset);

			sheet.updateWithValues([
				{
					range: "Variables!B2",//STREAM_START
					values: [
						[
							moment().unix()
						]
					]
				}
			]);
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
					range: "Variables!B3",//PREDICTION_TIMELIMIT
					values: [
						[
							mpd[2]
						]
					]
				}

			]);

			twitchBot.say(channel, "MpD sheet updated!");
			
			/*
				start timer and toggle tracking
			*/
		}

		event = message.match(/^!event (.*)/i)

		if(event){

			sheet.appendWithValue(
				"Events!A:A",
				[
					[
						event[1],
						moment().unix()
					]
				]
			);
		}

		killboss = message.match(/^!killboss (.*)/i)

		if(killboss){

			sheet.appendWithValue(
				"Defeated!A:A",
				[
					[
						killboss[1],
						moment().unix()
					]
				]
			);
			twitchBot.say(channel, killboss[1]+" has been defeated and added to the list!");

		}

		currentboss = message.match(/^!currentboss (.*)/i)

		if(currentboss){

			sheet.updateWithValues([
				{
					range: "Variables!B13",//CURRENT_BOSS
					values: [
						[
							currentboss[1]
						]
					]
				}

			]);
			twitchBot.say(channel, currentboss[1]+" is the current boss!");

		}

	}

	deaths = message.match(/^!deaths$/);

	if(deaths){

		console.log(colors.fg.green, "!deaths command triggered by\t", colors.reset, tags.username);

		setTimeout(() => {
			sheet.getCell(
				twitchBot,
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
				twitchBot,
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
				twitchBot,
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
				twitchBot,
				"Phrases!A4",{
					"command" : "say",
					"channel" : channel
				}
			)
		}, 2000);
	}

	boss = message.match(/^!boss(es)?$/);

	if(boss){

		console.log(colors.fg.green, "!boss command triggered by\t", colors.reset, tags.username);

		setTimeout(() => {
			sheet.getCell(
				twitchBot,
				"Phrases!A6",{
					"command" : "say",
					"channel" : channel
				}
			)
		}, 2000);
	}

});