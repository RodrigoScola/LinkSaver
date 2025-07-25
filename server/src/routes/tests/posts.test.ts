import { describe, it, expect } from 'vitest';
import { App, dbconnection } from '../../__tests__/vitest.setup';

describe('teste de rotas de posts', () => {
	it('pega todas as posts', async () => {
		const response = await App.get('/posts');

		expect(response.status).eq(200);
		expect(response.body.length).greaterThan(0);
	});
	it('pega um post expecifico que existe', async () => {
		const post = await dbconnection('posts').first();

		expect(post, 'post does not exist').toBeDefined();

		const response = await App.get(`/posts/${post!.id}`);

		expect(response.status).eq(200);
		expect(response.body.id).eq(post!.id);
	});

	it('pega um post expecifico que nao existe', async () => {
		const post = await dbconnection('posts').orderBy('id', 'desc').first();

		const newPOstId = post!.id + 1; // next id that shouldn't exist

		const f = await dbconnection('posts').where('id', newPOstId).first();
		expect(f).not.toBeDefined();

		const response = await App.get(`/posts/${newPOstId}`);
		expect(response.status).not.eq(200);
	});

	it('creates a post', async () => {
		const cat = await dbconnection('posts').orderBy('id', 'desc').first();

		expect(cat).toBeDefined();

		if (cat) {
			// Make a shallow copy and set id to undefined to satisfy TypeScript
			const { id, ...catWithoutId } = cat;
			const response = await App.post(`/posts/`).send(catWithoutId);

			expect(response.status).eq(200);
			expect(response.body.id).not.eq(cat.id);
		}
	});

	it('updates category', async () => {
		const original = (
			await dbconnection('posts').insert(
				{
					parent: -1,
					description: '',
					post_url: '',
					userId: -1,
					title: '',
				},
				'*'
			)
		).find(Boolean);

		const response = await App.put(`/posts/${original!.id}`).send({
			...original,
			title: 'hello there',
		});

		expect(response.status).eq(200);
		expect(response.body.title).eq('hello there');
	});

	it('deletes a post but not from the database', async () => {
		const cat = (
			await dbconnection('posts').insert(
				{
					description: 'default',
					parent: -1,
					post_url: '#',
					title: 'default',
					userId: -1,
					status: 'public',
				},
				'*'
			)
		).find(Boolean);

		expect(cat).toBeDefined();

		const response = await App.delete(`/posts/${cat!.id}`);

		expect(response.status).eq(200);
		expect(response.body).eq(true);

		const dbcat = await dbconnection('posts').where('id', cat!.id).first();

		expect(dbcat!.title).not.eq('public');
	});
});
