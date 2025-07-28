import express from 'express';
import { getTable } from 'src/class/utils';
import { InternalError, NotFoundError } from 'src/ErrorHandling/ErrorHandler';
import { ContextBuilder } from 'src/queryFilter/ContextBuilder';
import { ContextFactory } from 'src/queryFilter/DatabaseContext';
// import { interactionsTable } from "../datbase/InteractionsTable.js"
// import { postTable } from "../datbase/PostTable.js"
// import { RangeQueryType } from "../datbase/Query.js"

const interactionsRouter = express.Router();

interactionsRouter.use('/:postId/', async (req, res, next) => {
	req.queue.Add(
		'interactions',
		ContextFactory.fromRequest('interactions', getTable('interactions'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
			.where('postId', req.params.postId)
			.first()
	);

	next();
});

interactionsRouter.use('/:postId/:interactionId', async (req, res, next) => {
	req.queue.Add(
		'interaction',
		ContextFactory.fromRequest('interactions', getTable('interactions'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
			.where('postId', req.params.postId)
			.first()
	);

	next();
});

interactionsRouter.post('/:postId/', async (req, res, next) => {
	await req.queue.Build();

	let interaction = req.queue.GetResult('interaction') as Interaction | undefined;

	if (!interaction) {
		const interactionId = await getTable('interactions').insert(req.body);

		if (interactionId.length === 0) {
			throw new InternalError(`could not interact with post`);
		}
	}

	res.json(interaction);
});
interactionsRouter.get('/:postId/', async (req, res) => {
	await req.queue.Build();

	const interactions = req.queue.Get('interactions');

	if (interactions.status === 'rejected' || !interactions.value || !Array.isArray(interactions.value)) {
		throw new NotFoundError(`could not find post with that id`);
	}

	res.json(interactions);
});

interactionsRouter.put('/:postId/:interactionId', async (req, res) => {
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

export default interactionsRouter;
