import express from 'express';
import { getTable } from 'src/class/utils';
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
