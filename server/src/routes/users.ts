import express from 'express';
import { User } from 'shared';
import { getTable } from 'src/class/utils';
import { InternalError, NotFoundError } from 'src/ErrorHandling/ErrorHandler';
import { ContextBuilder } from 'src/queryFilter/ContextBuilder';
import { ContextFactory } from 'src/queryFilter/DatabaseContext';
import { privatizeItem } from 'src/Storage';

const usersRouter = express.Router();

usersRouter.param('id', async (req, res, next, id) => {
	req.queue.Add(
		'user',
		ContextFactory.fromRequest('users', getTable('users'))
			.SetParameters(ContextBuilder.FromParameters(req.query))
			.Build()
			.where('id', id)
			.first()
	);

	next();
});

/**
 * ? figure out if we want to do rankings later
 * ? but we def dont want to have availabe user info all nice like that
 * ? forgot how to say things
 */
usersRouter.get('/', async (req, res) => {
	const q = ContextFactory.fromRequest('users', getTable('users'))
		.SetParameters(
			ContextBuilder.FromParameters(req.query, {
				google_id: 'string',
				id: -1,
				isLive: true,
				status: 'public',
				image_url: '',
			} as User)
		)
		.Build();

	req.queue.Add('users', q);

	await req.queue.Build();

	const users = req.queue.Get('users');
	if (users.status === 'rejected' || !users.value) {
		throw new NotFoundError(`could not find users with those parameters`);
	}
	res.json(users.value);
});
usersRouter.post('/:id', async (req, res) => {
	try {
		req.queue.Add('new_user', getTable('users').insert(req.body));

		await req.queue.Build();

		const newUser = req.queue.Get('new_user');
		if (newUser.status === 'rejected' || !newUser.value || !Array.isArray(newUser.value)) {
			throw new NotFoundError(`could not find newUser with that id`);
		}

		const userPromise = await getTable('users').where('id', newUser.value[0]).first();

		if (!userPromise) throw new InternalError();

		res.json(userPromise);
	} catch (err) {
		throw new InternalError();
	}
});
usersRouter.get('/:id', async (req, res) => {
	await req.queue.Build();

	const userPromise = req.queue.Get('user');

	if (userPromise.status === 'rejected' || !userPromise.value) {
		throw new NotFoundError(`could not find user with that id`);
	}

	res.send(userPromise.value);
});

usersRouter.put('/:id', async (req, res) => {
	await req.queue.Add('updated_user', getTable('users').update(req.body).where('id', req.params.id)).Build();

	const hasUser = Boolean(req.queue.GetResult('user'));

	if (!hasUser) throw new NotFoundError('could not complete the operation');

	const updatedUserId = req.queue.Get('updated_user');
	if (updatedUserId.status === 'rejected' || !updatedUserId.value) {
		throw new NotFoundError('could not complete the operation');
	}

	const user = await getTable('users').where('id', req.params.id).first();

	res.send(user);
});
usersRouter.post('/', async (req, res) => {
	try {
		req.queue.Add('new_user', getTable('users').insert(req.body).catch(console.error));

		await req.queue.Build();

		const userId = req.queue.GetResult('new_user');

		if (!userId || !Array.isArray(userId)) {
			throw new InternalError();
		}

		const user = await getTable('users').where('id', userId[0]);

		res.json(user);
	} catch (err) {
		console.log(err, 'this is the error');
		throw new InternalError();
	}
});

usersRouter.delete('/:id', async (req, res) => {
	await req.queue.Build();

	const original = req.queue.Get('user');

	if (original.status !== 'fulfilled' || !original.value) {
		throw new NotFoundError(`user not found`);
	}

	try {
		//TODO: FIGURE THIS OUT
		//@ts-expect-error this is just to test figure this out
		await privatizeItem(getTable('users').where('id', req.params.id));
	} catch (err) {
		res.json(false);
	}

	res.json(true);
});

export default usersRouter;
