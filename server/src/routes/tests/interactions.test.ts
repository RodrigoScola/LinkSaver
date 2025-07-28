import { describe, it, expect } from 'vitest';
import { App, dbconnection } from '../../__tests__/vitest.setup';

describe.only('rotas de usuarios', () => {
	it.only('can create interaction', async () => {
		const user = await dbconnection('users').first();
		const post = await dbconnection('posts').first();
		expect(post, 'could not grab post').toBeDefined();
		expect(user, 'could not grab user').toBeDefined();

		const response = await App.post(`/interactions/${post!.id}`).send({
			created_at: Date.now(),
			postId: post!.id,
			status: 'public',
			type: 'like',
			updated_at: Date.now(),
			userId: user!.id,
		} as unknown as OmitBy<Interaction, 'id'>);
		expect(response.statusCode).eq(200);
	});

	// it('cria um usuario', async () => {
	// 	const cat = await dbconnection('users').orderBy('id', 'desc').first();
	// 	expect(cat).toBeDefined();
	// 	if (cat) {
	// 		// Make a shallow copy and set id to undefined to satisfy TypeScript
	// 		cat.google_id = randomString(43);
	// 		const { id, ...catWithoutId } = cat;
	// 		const response = await App.post(`/users/`).send(catWithoutId);
	// 		expect(response.status).eq(200);
	// 		expect(response.body.id).not.eq(cat.id);
	// 	}
	// });
	// it('updates user', async () => {
	// 	const id = randomString(43);
	// 	const original = (
	// 		await dbconnection('users').insert(
	// 			{
	// 				google_id: id,
	// 			},
	// 			'*'
	// 		)
	// 	).find(Boolean);
	// 	const response = await App.put(`/users/${original!.id}`).send({
	// 		...original,
	// 	});
	// 	expect(response.status).eq(200);
	// 	expect(response.body.google_id).eq(id);
	// });
	// it('deletes a user but not from the database', async () => {
	// 	const id = randomString(43);
	// 	const cat = (
	// 		await dbconnection('users').insert(
	// 			{
	// 				google_id: id,
	// 			},
	// 			'*'
	// 		)
	// 	).find(Boolean);
	// 	expect(cat).toBeDefined();
	// 	const response = await App.delete(`/users/${cat!.id}`);
	// 	expect(response.status).eq(200);
	// 	expect(response.body).eq(true);
	// 	const dbcat = await dbconnection('users').where('id', cat!.id).first();
	// 	expect(dbcat!.status).not.eq('public');
	// });
});
