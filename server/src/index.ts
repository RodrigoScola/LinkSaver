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
import { getTable } from './class/utils';
import { postCategoryRouter } from './routes/post_category';
import { Category, Post, PostCategories } from 'shared';
app.use(cors());
app.use(bodyParser.json());

app.use('/', (req, _, next) => {
	req.queue = new AsyncQueue();

	next();
});
app.use('/postCategories/', postCategoryRouter);

app.use('/_', utilRouter);
app.use('/folders', foldersRouter);
app.use('/categories', categoryRouter);

app.use('/posts', postsRouter);
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

		// getTable('categories')
		// 	.insert({ color: '#00AA00', name: 'newCatl', status: 'public', userId: -1 } as Category)
		// 	.catch(console.error);

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
