[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21865129)
# Backend Comments ✨
This backend gets from my database comments, it posts them and they can be deleted. So basically on the frontend when the quiz is done you can add a comment and delete it.

Website url: [website.be](website.be) (optional)
http://localhost:5173/ not sure about this one.

## Sources 🗃️
The first part of the code are from the courses or monitoraat 
The delete part came from Claude: https://claude.ai/share/2ab8e917-1ecb-4321-8824-f57386dc6abe

Rik Baselier -> helped me fix some error in my delete part 
app.delete("/comments/:id", async (req, res) => {})
	
		let id = req.params.id;
