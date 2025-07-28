import { describe, it, expect } from 'vitest';
import { App, dbconnection } from '../../__tests__/vitest.setup';

describe.only('rotas de usuarios', () => {
	it.only('pega um usuario', async () => {
		const post = await dbconnection('users').first();

		expect(post, 'user does not exist').toBeDefined();

		const response = await App.get(`/users/${post!.id}`);

		console.log(response.body);

		expect(response.status).eq(200);
		expect(response.body.id).eq(post!.id);
	});

	it('cria um usuario', async () => {
		const cat = await dbconnection('users').orderBy('id', 'desc').first();

		expect(cat).toBeDefined();

		if (cat) {
			// Make a shallow copy and set id to undefined to satisfy TypeScript
			cat.google_id = randomString(43);
			const { id, ...catWithoutId } = cat;
			const response = await App.post(`/users/`).send(catWithoutId);

			expect(response.status).eq(200);
			expect(response.body.id).not.eq(cat.id);
		}
	});

	it('updates user', async () => {
		const id = randomString(43);
		const original = (
			await dbconnection('users').insert(
				{
					google_id: id,
				},
				'*'
			)
		).find(Boolean);

		const response = await App.put(`/users/${original!.id}`).send({
			...original,
		});

		expect(response.status).eq(200);
		expect(response.body.google_id).eq(id);
	});

	it('deletes a user but not from the database', async () => {
		const id = randomString(43);
		const cat = (
			await dbconnection('users').insert(
				{
					google_id: id,
				},
				'*'
			)
		).find(Boolean);

		expect(cat).toBeDefined();

		const response = await App.delete(`/users/${cat!.id}`);

		expect(response.status).eq(200);
		expect(response.body).eq(true);

		const dbcat = await dbconnection('users').where('id', cat!.id).first();

		expect(dbcat!.status).not.eq('public');
	});
});

function randomString(length: number): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
