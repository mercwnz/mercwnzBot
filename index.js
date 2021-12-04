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
	channels: ['mercwnz','pnkyfish']
});

console.log("Connect to IRC");
client.connect();
client.on('message', (channel, tags, message, self) => {

	if(self) return;

	if(
		(tags.username === 'pnkyfish')
		|| (tags.username === 'mercwnz')
		|| (tags.username === 'StreamElements')
	){
		uptime = message.match(/has been streaming for (\d+) hours (\d+) mins/i);

		if(uptime){

			let t = moment.duration(uptime[1].padStart(2, '0')+":"+uptime[2].padStart(2, '0')+":00");
			let ss = moment().subtract(t).format("HH:mm:ss");

			console.log(colors.fg.green, "Stream Start updated\t", colors.reset, ss);

			sheet.updateWithValues([
				{
					range: "Parsed!C10",//stream start
					values: [[ss]]
				}
			]);
		}

		die = message.match(/pnkyfish just died again. She has now died (\d+) times/i);

		if(die){

			console.log(colors.fg.red, "Die update\t", colors.reset, die[1]);

			sheet.appendWithValue("Deaths!A:A",[[moment().format("YYYY-MM-DD"),moment().unix()]]);

			sheet.updateWithValues([
				{
					range: "Parsed!C5",//current deaths
					values: [[die[1]]]
				},
				{
					range: "Parsed!C12",//last death
					values: [[moment().format("HH:mm:ss")]]
				}
			]);

			setTimeout(() => {
				sheet.getCell(client,"Phrases!A1",{
					"command":"say",
					"channel":channel
				})
			}, 2000);
		}

		mpd = message.match(/^!mpd (\d+) (\d+) (\d+)/i); //!ps timeLimit current target

		if(mpd){

			console.log(colors.fg.cyan, "MpD sheet updated\t", colors.reset, mpd[0]);

			sheet.updateWithValues([
				{
					range: "Parsed!C11",//Time start
					values: [[moment().format("HH:mm:ss")]]
				},
				{
					range: "Parsed!C8",//Time limit
					values: [[mpd[1]]]
				},
				{
					range: "Parsed!C4",//Start Deaths
					values: [[mpd[2]]]
				},
				{
					range: "Parsed!C5",//Current Deaths
					values: [[mpd[2]]]
				},
				{
					range: "Parsed!C6",//prediction target
					values: [[mpd[3]]]
				}
			]);

			client.say("mercwnz","MpD sheet updated!");
		}

		start = message.match(/^!start/);

		if(start){

			console.log(colors.fg.cyan, "Update stream start\t", colors.reset, moment().format("HH:mm:ss"));

			sheet.updateWithValues([
				{
					range: "Parsed!C10",//Time start
					values: [[moment().format("HH:mm:ss")]]
				}
			]);

			client.say(channel,"Time updated!")
		}
	}
});