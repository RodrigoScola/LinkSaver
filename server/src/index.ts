import './process';
import 'express-async-errors';
import f from 'dotenv';

f.config();

import express, { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import categoryRouter from './routes/category.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import cors from 'cors';
export const app = express();

import postInfoRouter from './routes/postInfo.js';
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
app.use(cors());
app.use(bodyParser.json());

app.use('/', (req, _, next) => {
	req.queue = new AsyncQueue();

	next();
});

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
postsRouter.use('/:id/', postInfoRouter);
foldersRouter.use('/:id/', postInfoRouter);
categoryRouter.use('/:id/', postInfoRouter);

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
		console.log('Server is listening in http://localhost:' + process.env.PORT);
	});
}
