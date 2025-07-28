import express from 'express';
import { getTable } from '../../src/class/utils';
import { ContextBuilder } from '../../src/queryFilter/ContextBuilder';
import { ContextFactory } from '../../src/queryFilter/DatabaseContext';
import { InternalError, NotFoundError } from 'src/ErrorHandling/ErrorHandler';
import { privatizeItem } from 'src/Storage';
// import { foldersTable } from '../datbase/FoldersTable.js';
// import { RangeQueryType, EqualQueryType } from '../datbase/Query.js';

const foldersRouter = express.Router();

foldersRouter.param('id', async (req, res, next, id) => {
	req.queue.Add(
		'folder',
		ContextFactory.fromRequest('folders', getTable('folders'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
			.where('id', id)
			.first()
	);

	next();
});

foldersRouter.get('/:id', async (req, res) => {
	// let post = req.post;
	// res.send(post);
});
foldersRouter.get('/', async (req, res) => {
	req.queue.Add(
		'folder',
		ContextFactory.fromRequest('folders', getTable('folders'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
	);

	await req.queue.Build();

	const folders = req.queue.Get('folder');

	if (folders.status === 'rejected' || !folders.value) {
		throw new NotFoundError('could not complete the operation');
	}

	res.json(folders.value);
});
foldersRouter.post('/', async (req, res) => {
	try {
		req.queue.Add('new_folder', getTable('folders').insert(req.body));

		await req.queue.Build();

		const folderId = req.queue.GetResult('new_folder');

		if (!folderId || !Array.isArray(folderId)) {
			throw new InternalError();
		}

		const folder = await getTable('folders').where('id', folderId[0]);

		res.json(folder);
	} catch (err) {
		throw new InternalError();
	}
});

foldersRouter.put('/:id', async (req, res) => {
	await req.queue

		.Add('updated_folder', getTable('folders').update(req.body).where('id', req.params.id))
		.Build();

	const hasFolder = Boolean(req.queue.GetResult('folder'));

	if (!hasFolder) {
		throw new NotFoundError('could not complete the operation');
	}

	const updatedFolderId = req.queue.Get('updated_folder');

	if (updatedFolderId.status === 'rejected' || !updatedFolderId.value) {
		throw new NotFoundError('could not complete the operation');
	}

	const folder = await getTable('folders').where('id', req.params.id).first();

	res.send(folder);
});

foldersRouter.delete('/:id', async (req, res) => {
	await req.queue.Build();

	const original = req.queue.Get('folder');

	if (original.status !== 'fulfilled' || !original.value) {
		throw new NotFoundError(`category not found`);
	}

	try {
		await privatizeItem(getTable('folders').where('id', req.params.id));
	} catch (err) {
		res.json(false);
	}

	res.json(true);
});
export default foldersRouter;
