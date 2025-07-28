import express from 'express';
import _ from 'lodash';
import { getTable } from '../../src/class/utils.js';
import { InternalError, InvalidIdError, NotFoundError } from '../../src/ErrorHandling/ErrorHandler.js';
import { ContextFactory } from '../../src/queryFilter/DatabaseContext.js';
import { ContextBuilder } from '../../src/queryFilter/ContextBuilder.js';
import { privatizeItem } from '../../src/Storage';
const postRouter = express.Router();

postRouter.param('postId', async (req, res, next, id) => {
	console.log(req);
	req.queue.Add(
		'post',
		ContextFactory.fromRequest('posts', getTable('posts'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
			.where('id', id)
			.first()
	);

	next();
});

postRouter.get('/:postId', async (req, res) => {
	await req.queue.Build();

	const post = req.queue.Get('post');

	if (post.status === 'rejected' || !post.value) {
		throw new NotFoundError(`could not find post with that id`);
	}

	res.send(post.value);
});

postRouter.get('/', async (req, res) => {
	await req.queue
		.Add(
			'posts',
			ContextFactory.fromRequest('posts', getTable('posts'))
				.SetParameters(ContextBuilder.FromParameters(req.query))
				.Build()
		)
		.Build();

	const posts = req.queue.Get('posts');

	if (posts.status === 'rejected' || !posts.value) {
		throw new NotFoundError(`could not get posts`);
	}

	res.send(posts.value);
});

postRouter.post('/', async (req, res) => {
	await req.queue.Build();
	let post: Post | undefined;

	try {
		//this is more ineficient but some databases dont return the whole thing
		//because i dont know which db im gonna go with then this is the solution
		const b = await getTable('posts').insert(req.body);

		if (Array.isArray(b) && typeof b[0] === 'number') {
			post = await getTable('posts').where('id', b[0]).first();
		}
	} catch (err) {
		throw new InternalError(`could not create post`);
	}

	res.json(post);
});

postRouter.delete('/:postId', async (req, res) => {
	await req.queue.Build();

	const post = req.queue.Get('post');
	if (post.status === 'rejected' || !post.value) {
		throw new NotFoundError(`could not get post with that id`);
	}

	try {
		await privatizeItem(getTable('posts').where('id', req.params.postId));
	} catch (err) {
		res.json(false);
	}

	res.json(true);
});

postRouter.put('/:postId', async (req, res) => {
	await req.queue.Build();

	const post = req.queue.Get('post');
	if (post.status === 'rejected' || !post.value) {
		throw new NotFoundError(`could not get post with that id`);
	}

	await getTable('posts').update(req.body).where('id', req.params.postId);

	const updatedPost = await getTable('posts').where('id', req.params.postId).first();

	res.send(updatedPost);
});

export default postRouter;
