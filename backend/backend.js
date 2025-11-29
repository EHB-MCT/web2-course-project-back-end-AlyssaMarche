import express from "express";
import { readFile, writeFile } from "node:fs/promises";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json()); //alle data van en naar de api is uniek

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.use(express.static("public"));

app.get("/api/comments", async (req, res) => {
	const contents = await readFile("comments.json", { encoding: "utf8" });
	const data = JSON.parse(contents);
	res.json(data);
});
app.get("/api/comments", async (req, res) => {
	//To get individually each id of the comments
	let id = req.query.id;
	//Read the comments file
	const contents = await readFile("comments.json", { encoding: "utf8" });
	const data = JSON.parse(contents);
	//get one bg
	let coms = data[id]; //vb. data.120677
	res.json(coms);
});

app.post("/api/comments", async (req, res) => {
	//Request the body so you can post a new comment via a body
	let data = req.body;
	console.log(data);
	res.send("succces");
});

app.delete("/api/comments", async (req, res) => {
    //This will delete a comment based on the username if not found it will return error messages
	try {
		let username = req.query.user;

		if (!username) {
			return res.status(400).json({ error: "Username is required" });
		}
        //Read the comments file
		const contents = await readFile("comments.json", { encoding: "utf8" });
		const data = JSON.parse(contents);
        //Find the index of the comment to delete
		const commentIndex = data.comments.findIndex(
			(comment) => comment.user === username
		);
        //If not found it returns an error message
		if (commentIndex === -1) {
			return res.status(404).json({ error: "Comment not found" });
		}
        //Remove the comment from the array
		const deletedComment = data.comments.splice(commentIndex, 1)[0];

		await writeFile("comments.json", JSON.stringify(data, null, 2));
        //Return a success message with the deleted comment
		res.json({
			message: "Comment deleted successfully",
			deletedComment: deletedComment,
		});
        //Return error message if any error
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to delete comment" });
	}
});
