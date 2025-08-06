import express from 'express';
import { Interaction } from 'shared';
import { getTable } from 'src/class/utils';
import { InternalError, NotFoundError } from 'src/ErrorHandling/ErrorHandler';
import { ContextBuilder } from 'src/queryFilter/ContextBuilder';
import { ContextFactory } from 'src/queryFilter/DatabaseContext';
// import { interactionsTable } from "../datbase/InteractionsTable.js"
// import { postTable } from "../datbase/PostTable.js"
// import { RangeQueryType } from "../datbase/Query.js"

const interactionsRouter = express.Router();

const baseInteraction: Interaction = {
	created_at: new Date().toString(),
	id: -1,
	postId: -1,
	status: 'public',
	type: 'like',
	updated_at: new Date().toString(),
	userId: -1,
};

interactionsRouter.use('/:interactionId/', async (req, res, next) => {
	req.queue.Add(
		'interaction',
		ContextFactory.fromRequest('interactions', getTable('interactions'))
			.SetParameters(ContextBuilder.FromParameters(req.query, baseInteraction))
			.Build()
			.where('id', req.params.interactionId)
			.first()
	);

	next();
});

interactionsRouter.post('/', async (req, res, next) => {
	await req.queue.Build();

	let interaction: Interaction | undefined = await getTable('interactions')
		.where('postId', req.body.postId)
		.andWhere('userId', req.body.userId)
		.first();

	if (!interaction) {
		const interactionId = await getTable('interactions').insert(req.body);

		if (interactionId.length === 0) {
			throw new InternalError(`could not interact with post`);
		}
	} else if (interaction.status === 'private') {
		interaction.status = 'public';
		await getTable('interactions').update(interaction).where('id', interaction.id);
	}

	res.json(interaction);
});
interactionsRouter.get('/', async (req, res) => {
	req.queue.Add(
		'interactions',
		ContextFactory.fromRequest('interactions', getTable('interactions'))
			.SetParameters(ContextBuilder.FromParameters(req.query, baseInteraction))
			.Build()
	);

	await req.queue.Build();

	const interactions = req.queue.Get('interactions');

	if (interactions.status === 'rejected' || !interactions.value || !Array.isArray(interactions.value)) {
		throw new NotFoundError(`could not find post with that id`);
	}

	res.json(interactions.value);
});

interactionsRouter.put('/:interactionId', async (req, res) => {
	await req.queue.Build();

	const interaction = req.queue.Get('interaction');

	if (interaction.status === 'rejected' || !interaction.value) {
		throw new NotFoundError(`could not find post with that id`);
	}

	let updatedRows = 0;

	try {
		updatedRows = await getTable('interactions').update(req.body).where('id', req.params.interactionId);
	} catch (err) {
		throw new InternalError();
	}

	if (updatedRows === 0) {
		throw new InternalError();
	}

	const interactions = await getTable('interactions').where('id', req.params.interactionId);

	res.json(interactions);
});
interactionsRouter.delete('/:interactionId', async (req, res) => {
	await req.queue.Build();

	const interaction = req.queue.Get('interaction');

	if (interaction.status === 'rejected' || !interaction.value) {
		throw new NotFoundError(`could not find post with that id`);
	}

	let updatedRows = 0;

	try {
		updatedRows = await getTable('interactions')
			.update('status', 'private')
			.where('id', req.params.interactionId);
	} catch (err) {
		res.json(false);
	}

	res.json(true);
});

export default interactionsRouter;
