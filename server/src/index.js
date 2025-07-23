import f from 'dotenv'

f.config()

import express  from "express"
import categoryRouter  from "./routes/category.js"
import postsRouter  from "./routes/posts.js"
import usersRouter  from "./routes/users.js"
import cors  from "cors"
export const app = express()

import  postInfoRouter  from "./routes/postInfo.js"
import bodyParser from "body-parser"
import foldersRouter from "./routes/folders.js"
import stackRouter from "./routes/stack.js"
import interactionsRouter from "./routes/interactions.js"
// import queryRouter from "./routes/queryRouter.js"
import utilRouter from "./routes/_.js"
import searchRouter from "./routes/search.js"
import { supabase } from './datbase/Table.js'
app.use(cors())
app.use(bodyParser.json())


app.use("/_", utilRouter)
// app.use("/categories", queryRouter)
// app.use("/folders", queryRouter)
// app.use("/search", queryRouter)
app.use("/folders", foldersRouter)
// app.use("/posts", queryRouter)
// app.use("/interactions", queryRouter)
// app.use("/users", queryRouter)
app.use("/categories", categoryRouter)
app.use("/posts", postsRouter)
app.use("/search", searchRouter)
app.use("/users", usersRouter)
app.use("/stack", stackRouter)
app.use("/interactions", interactionsRouter)
postsRouter.use("/:id/", postInfoRouter)
foldersRouter.use("/:id/", postInfoRouter)
categoryRouter.use("/:id/", postInfoRouter)

app.listen(process.env.PORT, async () => {
	console.log("Server is listening in http://localhost:" + process.env.PORT)



	// await supabase('categories').insert({ color: '#000000',
	// 	name: 'hello there',
	// 	status: 'public'
	// });

	supabase('categories').then(console.log)
})
