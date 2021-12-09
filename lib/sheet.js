require('dotenv').config();

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const googleAuth = require('./googleAuth');

function updateWithValues(data){
	// https://stackoverflow.com/questions/51196367/how-to-update-multiple-cells-via-the-google-sheets-api
	function callback(auth) {
		const sheets = google.sheets({version: 'v4', auth});
		sheets.spreadsheets.values.batchUpdate({
			spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
			resource: { 
				valueInputOption: "RAW",
				data:data
			}
		},
		(err, result) => {
			if (err) {
				console.log(err.errors);
				return;
			}
			console.log(result);
		});
	}
	fs.readFile(process.env.GOOGLE_CREDENTIALS_FILE, (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		googleAuth.authorize(JSON.parse(content), callback);

	});
}

function appendWithValue(range,data){
	function callback(auth) {
		const sheets = google.sheets({version: 'v4', auth});
		sheets.spreadsheets.values.append({
			spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
			range: range,
			valueInputOption: 'USER_ENTERED',
			insertDataOption: 'OVERWRITE', //INSERT_ROWS
			resource: {
				"majorDimension": "ROWS",
				"values": data
			},
		},
		(err, result) => {
			if (err) {
				console.log(err.errors);
				console.log(result);
			}
		});
	}
	fs.readFile(process.env.GOOGLE_CREDENTIALS_FILE, (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		googleAuth.authorize(JSON.parse(content), callback);

	});
}

function clearRange(range){
	function callback(auth){
		const sheets = google.sheets({version: 'v4', auth});
		sheets.spreadsheets.values.clear({
			spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
			range: range,
		},
		(err, result) => {
			if (err) {
				console.log(err.errors);
				return;
			}
			console.log(result);			
		});
	}
	fs.readFile(process.env.GOOGLE_CREDENTIALS_FILE, (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		googleAuth.authorize(JSON.parse(content), callback);

	});
}

function getCell(client=null,range,arg={}){
	function callback(auth){
		const sheets = google.sheets({version: 'v4', auth});
		sheets.spreadsheets.values.get({
			spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
			range: range,
		},
		(err, result) => {
			if (err) {
				console.log(err.errors);
				return;
			}

			console.log(result);

			if(arg.command === "say"){
				client.say(arg.channel,result.data.values[0][0])
			}
		})
	}

	fs.readFile(process.env.GOOGLE_CREDENTIALS_FILE, (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		googleAuth.authorize(JSON.parse(content), callback);
	});
}

module.exports = { updateWithValues, appendWithValue, clearRange, getCell };