import express from 'express';
import { PostCategories } from 'shared';
import { getTable } from 'src/class/utils';
import { InternalError } from 'src/ErrorHandling/ErrorHandler';
import { ContextBuilder } from 'src/queryFilter/ContextBuilder';
import { ContextFactory } from 'src/queryFilter/DatabaseContext';

export const postCategoryRouter = express.Router({ mergeParams: true });

postCategoryRouter.get('/', async (req, res) => {
	await req.queue
		.Add(
			'categories',
			ContextFactory.fromRequest('post_categories', getTable('post_categories'))
				.SetParameters(ContextBuilder.FromParameters(req.query))
				.Build()
				.where('post_id', Number(req.params.postId))
		)
		.Build();

	const rs = req.queue.GetResult('categories') || [];

	res.json(rs);
});

postCategoryRouter.post('/', async (req, res) => {
	await req.queue.Build();

	let post: PostCategories | undefined;

	try {
		//this is more ineficient but some databases dont return the whole thing
		//because i dont know which db im gonna go with then this is the solution
		const b = await getTable('post_categories').insert(req.body);

		if (Array.isArray(b) && typeof b[0] === 'number') {
			post = await getTable('posts').where('id', b[0]).first();
		}
	} catch (err) {
		throw new InternalError(`could not create post`);
	}

	res.json(post);
});
