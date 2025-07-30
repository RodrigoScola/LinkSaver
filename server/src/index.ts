import './process';
import 'express-async-errors';
import f from 'dotenv';

f.config();

import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import categoryRouter from './routes/category.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import cors from 'cors';
export const app = express();

import bodyParser from 'body-parser';
import foldersRouter from './routes/folders.js';
import stackRouter from './routes/stack.js';
import interactionsRouter from './routes/interactions.js';
import utilRouter from './routes/_.js';
// import searchRouter from './routes/search.js';
import { ErrorHandler } from './ErrorHandling/ErrorHandler.js';
import { AsyncQueue } from './class/async';
import { dbconnection } from './__tests__/vitest.setup';
import { getTable } from './class/utils';
import { postCategoryRouter } from './routes/post_category';
import postRouter from './routes/posts.js';
import { Category, Post, PostCategories } from 'shared';
app.use(cors());
app.use(bodyParser.json());

app.use('/', (req, _, next) => {
	req.queue = new AsyncQueue();

	next();
});
postRouter.use('/:postId/categories', postCategoryRouter);

app.use('/_', utilRouter);
// app.use("/categories", queryRouter)
// app.use("/folders", queryRouter)
// app.use("/search", queryRouter)
app.use('/folders', foldersRouter);
// app.use("/posts", queryRouter)
// app.use("/interactions", queryRouter)
// app.use("/users", queryRouter)
app.use('/categories', categoryRouter);

app.use('/posts', postsRouter);
// app.use('/search', searchRouter);
app.use('/users', usersRouter);
app.use('/stack', stackRouter);
app.use('/interactions', interactionsRouter);

const EFunction: ErrorRequestHandler = (
	err: Error,
	__: Request,
	res: Response,
	//!AAAAAAAAAAAAAAAAAAAA DO NOT REMOVE THIS
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	___: NextFunction
) => {
	ErrorHandler.handle(err, res);
};

app.use(EFunction);

if (process.env.NODE_ENV !== 'test') {
	app.listen(process.env.PORT, async () => {
		// await generateDummyCategories();

		console.log('Server is listening in http://localhost:' + process.env.PORT);
	});
}

async function generateDummyCategories() {
	const q = new AsyncQueue();

	await q.Add('categories', getTable('categories')).Add('posts', getTable('posts')).Build();

	const categories = q.GetResult('categories') as Category[];
	const posts = q.GetResult('posts') as Post[];

	for (const cat of categories) {
		const post = posts.at(Math.floor(Math.random() * posts.length));

		if (!post) {
			console.error(`could not get post`);
			continue;
		}

		q.Add(
			`like_${post!.id}`,
			getTable('post_categories').insert({
				category_id: cat.id,
				post_id: post!.id,
			} as PostCategories)
		);
	}

	await q.Build();
}
