import express from 'express';
import { PostCategories } from 'shared';
import { getTable } from 'src/class/utils';
import { InternalError, NotFoundError } from 'src/ErrorHandling/ErrorHandler';
import { ContextBuilder } from 'src/queryFilter/ContextBuilder';
import { ContextFactory } from 'src/queryFilter/DatabaseContext';
import { privatizeItem } from 'src/Storage';
import { b } from 'vitest/dist/chunks/suite.d.FvehnV49';

export const postCategoryRouter = express.Router({ mergeParams: true });

postCategoryRouter.use('/:postCategoryId', async (req, res, next) => {
	req.queue.Add(
		'post_category',
		ContextFactory.fromRequest('post_categories', getTable('post_categories'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
			.where('id', req.params.postCategoryId)
			.first()
	);

	next();
});

postCategoryRouter.get('/', async (req, res) => {
	await req.queue
		.Add(
			'categories',
			ContextFactory.fromRequest('post_categories', getTable('post_categories'))
				.SetParameters(
					ContextBuilder.FromParameters(req.query, {
						category_id: -1,
						id: 1,
						post_id: 1,
						status: 'public',
						userId: 1,
					} as PostCategories)
				)
				.Build()
		)
		.Build();

	const rs = req.queue.GetResult('categories') || [];

	res.json(rs);
});

postCategoryRouter.post('/', async (req, res) => {
	let postId = 0;

	req.queue.Add(
		'post_category',

		ContextFactory.fromRequest('post_categories', getTable('post_categories'))
			.SetParameters(ContextBuilder.FromParameters(req.body))
			.Build()
	);

	await req.queue.Build();

	const existingPostCategory = req.queue.GetResult<PostCategories>('post_category') as PostCategories;

	if (existingPostCategory) {
		getTable('post_categories').update(req.body).where('id', existingPostCategory.id);

		postId = existingPostCategory.id;
	} else {
	}

	try {
		//this is more ineficient but some databases dont return the whole thing
		//because i dont know which db im gonna go with then this is the solution
		const b = await getTable('post_categories').insert(req.body);

		if (Array.isArray(b) && typeof b[0] === 'number') {
			postId = b[0];
		}
	} catch (err) {
		throw new InternalError(`could not create post`);
	}

	const post = await getTable('post_categories').where('id', postId).first();

	res.json(post);
});
postCategoryRouter.delete('/:postCategoryId', async (req, res, next) => {
	console.log('aa');
	await req.queue.Build();

	const post = req.queue.Get('post_category');
	if (post.status === 'rejected' || !post.value) {
		throw new NotFoundError(`could not get post with that id`);
	}

	try {
		await privatizeItem(getTable('post_categories').where('id', req.params.postCategoryId));
	} catch (err) {
		console.error(err);
		return res.json(false);
	}

	res.json(true);
});
