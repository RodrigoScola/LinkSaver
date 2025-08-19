import express from 'express';
import { ContextFactory } from '../../src/queryFilter/DatabaseContext.js';
import { getTable } from '../../src/class/utils';
import { InternalError, NotFoundError } from '../../src/ErrorHandling/ErrorHandler';
import { privatizeItem } from '../../src/Storage';
import { ContextBuilder } from '../../src/queryFilter/ContextBuilder.js';
import { Category } from 'shared';

const categoryRouter = express.Router();

categoryRouter.param('id', async (req, res, next, id) => {
	req.queue.Add(
		'category',
		ContextFactory.fromRequest('categories', getTable('categories'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
			.where('id', id)
			.first()
	);

	next();
});

categoryRouter.get('/:id', async (req, res) => {
	await req.queue.Build();

	const category = req.queue.Get('category');

	if (category.status !== 'fulfilled' || !category.value) {
		throw new NotFoundError(`could not get category`);
	}

	res.send(category.value);
});
categoryRouter.get('/', async (req, res) => {
	const factory = ContextFactory.fromRequest('categories', getTable('categories'))
		.SetParameters(req.query)
		.Build();

	req.queue.Add('categories', factory);

	await req.queue.Build();
	const categoryResult = req.queue.Get('categories');

	if (categoryResult.status !== 'fulfilled' || !categoryResult.value) {
		throw new InternalError('could not get categories');
	}

	res.send(categoryResult.value);
});

categoryRouter.post('/', async (req, res) => {
	await req.queue.Build();
	let category: Category | undefined;

	try {
		//this is more ineficient but some databases dont return the whole thing
		//because i dont know which db im gonna go with then this is the solution
		const b = await getTable('categories').insert(req.body);

		if (Array.isArray(b) && typeof b[0] === 'number') {
			category = await getTable('categories').where('id', b[0]).first();
		}
	} catch (err) {
		throw new InternalError(`could not create category`);
	}

	res.json(category);
});

categoryRouter.delete('/:id', async (req, res) => {
	await req.queue.Build();

	const original = req.queue.Get('category');

	if (original.status !== 'fulfilled' || !original.value) {
		throw new NotFoundError(`category not found`);
	}

	try {
		//TODO: FIGURE THIS OUT
		//@ts-expect-error this is just to test figure this out
		await privatizeItem(getTable('categories').where('id', req.params.id));
	} catch (err) {
		res.json(false);
	}

	res.json(true);
});
categoryRouter.put('/:id', async (req, res) => {
	await req.queue.Build();

	const original = req.queue.Get('category');

	if (original.status !== 'fulfilled' || !original.value) {
		throw new NotFoundError(`category not found`);
	}
	await getTable('categories').update(req.body).where('id', req.params.id);

	const updated = await getTable('categories').where('id', req.params.id).first();

	res.json(updated);
});

export default categoryRouter;
