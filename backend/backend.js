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
