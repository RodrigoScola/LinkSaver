import { Post } from 'shared';
import express from 'express';
import _ from 'lodash';
import { getTable } from '../../src/class/utils.js';
import { InternalError, InvalidIdError, NotFoundError } from '../../src/ErrorHandling/ErrorHandler.js';
import { ContextFactory } from '../../src/queryFilter/DatabaseContext.js';
import { ContextBuilder } from '../../src/queryFilter/ContextBuilder.js';
import { privatizeItem } from '../../src/Storage';
const postRouter = express.Router();

postRouter.param('postId', async (req, res, next, id) => {
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
postRouter.get('/:postId/interactions', async (req, res) => {
	req.queue.Add(
		'post_interactions',
		getTable('interactions').select('type').count('type as count').groupBy('type')
	);

	await req.queue.Build();

	const interactions = req.queue.Get('post_interactions');

	if (interactions.status === 'rejected' || !interactions.value || !Array.isArray(interactions.value)) {
		throw new NotFoundError(`could not find interactions for post with that id`);
	}

	const groupedInteractions = interactions.value.reduce((acc, interaction) => {
		const type = interaction.type;
		if (!acc[type]) {
			acc[type] = 0;
		}
		acc[type] += interaction.count;
		return acc;
	}, {});

	res.json(groupedInteractions);
});

const basePost: Post = {
	created_at: Date.now().toString(),
	description: '',
	id: -1,
	post_url: '',
	status: 'private',
	title: '',
	updated_at: Date.now().toString(),
	userId: -1,
	parent: -1,
};

postRouter.get('/', async (req, res) => {
	await req.queue
		.Add(
			'posts',
			ContextFactory.fromRequest('posts', getTable('posts'))
				.SetParameters(ContextBuilder.FromParameters(req.query, basePost))
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
		console.log(`error`, err);
		throw new InternalError(`could not create post`);
	}

	res.json(post);
});

postRouter.delete('/:postId', async (req, res) => {
	await req.queue.Build();

	console.log('building', req.queue);

	const post = req.queue.Get('post');
	if (post.status === 'rejected' || !post.value) {
		throw new NotFoundError(`could not get post with that id`);
	}

	try {
		//TODO: FIGURE THIS OUT
		//@ts-expect-error this is just to test figure this out
		await privatizeItem(getTable('posts').where('id', req.params.postId));
	} catch (err) {
		console.error(`error deleting post`, err);
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
