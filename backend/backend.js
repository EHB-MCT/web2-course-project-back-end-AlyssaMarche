import express from "express";
// import { readFile, writeFile } from "node:fs/promises";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import "dotenv/config";
import cors from "cors";

// const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

let db;
let commentsCollection;

// Connect to MongoDB
async function connectDB() {
	try {
		await client.connect();
		console.log("Connected to MongoDB!");

		db = client.db("courseproject-web2-2526"); // Change to your database name
		commentsCollection = db.collection("comments");

		// Optional: Create an index on username for faster queries
		await commentsCollection.createIndex({ user: 1 });
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
}

//Create the app that is doing everything
const app = express();
//Set the port/door to enter
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json()); //alle data van en naar de api is uniek

// app.listen(port, () => {
// 	console.log(`Example app listening on port ${port}`);
// });

// app.get("/api/comments", async (req, res) => {
// 	const contents = await readFile("comments.json", { encoding: "utf8" });
// 	const data = JSON.parse(contents);
// 	res.json(data);
// });

app.get("/", (req, res) => {
	res.json({
		message: "Comments API is running",
		status: "ok",
		endpoints: {
			getComments: "GET /api/comments",
			getCommentById: "GET /api/comments?id={id}",
			createComment: "POST /api/comments",
			deleteComment: "DELETE /api/comments?user={username}"
		}
	});
});

app.get("/comments", async (req, res) => {
	//To get individually each id of the comments
	try {
		let id = req.query.id;
		if (id) {
			//Get one comments by id
			const comment = await commentsCollection.findOne({
				_id: new ObjectId(id),
			});
			if (!comment) {
				return res.status(404).json({ error: "Comment not found" });
			}
			return res.json(comment);
		}
		//Get all comments
		const comments = await commentsCollection.find().toArray();
		res.json(comments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch comments" });
	}
});

app.post("/comments", async (req, res) => {
	//Request the body so you can post a new comment via a body
	try {
		let data = req.body;

		const result = await commentsCollection.insertOne(data);

		console.log("Inserted comment:", result.insertId);

		res.status(201).json({
			message: "Success",
			id: result.insertedId,
			comment: data,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create comment" });
	}
});

app.delete("/comments", async (req, res) => {
	//This will delete a comment based on the username if not found it will return error messages
	try {
		let id = req.query.id;

		if (!id) {
			return res.status(400).json({ error: "Username is required" });
		}
		const allComments = await commentsCollection.find().toArray();
		console.log("All comments:", JSON.stringify(allComments, null, 2));

		//Read the comments file
		const result = await commentsCollection.findOneAndDelete({
			_id: new ObjectId(id),
		});
		if (!result) {
			return res.status(404).json({ error: "Comment not found" });
		}
		res.json({
			message: "Comment deleted successfully",
			deletedComment: result,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to delete comment" });
	}
});

connectDB().then(() => {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
});
