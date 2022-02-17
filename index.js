require('dotenv').config();

const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');

const uri =
	"mongodb://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@"+process.env.MONGO_ADDR+"/?retryWrites=true&w=majority";




// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

//of

//https://docs.mongodb.com/drivers/node/current/usage-examples/insertOne/




// const client = new MongoClient(uri);

// async function insertDeath() {
// 	try {
// 		await client.connect();
// 		const database = client.db("pnkyfish");
// 		const deaths = database.collection("deaths");

// 		const doc = {
// 			TOD: new Date()
// 		}

// 		const result = await deaths.insertOne(doc);

// 		console.log(`A document was inserted with the _id: ${result.insertedId}`);
// 	}

// 	finally {
// 		await client.close();
// 	}
// }

// // insertDeath().catch(console.dir);


// async function countCurrentDeaths() {
// 	try {
// 		await client.connect();
// 		const database = client.db("pnkyfish");
// 		const deaths = database.collection("deaths");

// 		const result = await deaths.find({
// 			releasedata: {
// 				$gte: ISODate("2010-04-29T00:00:00.000Z"),
// 				$lt: ISODate("2010-05-01T00:00:00.000Z")
// 			}
// 		}).count();

// 		console.log(`A document was inserted with the _id: ${result}`);
// 	}

// 	finally {
// 		await client.close();
// 	}
// }
// countCurrentDeaths().catch(console.dir);