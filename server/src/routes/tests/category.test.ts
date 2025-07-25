import { describe, it, expect } from 'vitest';
import { App, dbconnection } from '../../__tests__/vitest.setup';

describe('teste de rotas de categorias', () => {
	it('pega todas as categorias', async () => {
		const response = await App.get('/categories');
		expect(response.status).eq(200);
		expect(response.body.length).greaterThan(0);
	});
	it('pega uma categoria expecifica que existe', async () => {
		const cat = await dbconnection('categories').first();
		expect(cat, 'category does not exist');
		const response = await App.get(`/categories/${cat!.id}`);
		expect(response.status).eq(200);
		expect(response.body.id).eq(cat!.id);
	});
	it('pega uma categoria expecifica que nao existe', async () => {
		const cat = await dbconnection('categories').orderBy('id', 'desc').first();
		const newcat = cat!.id + 1; // next id that shouldn't exist
		const f = await dbconnection('categories').where('id', newcat).first();
		expect(f).not.toBeDefined();
		const response = await App.get(`/categories/${newcat}`);
		expect(response.status).not.eq(200);
	});
	it('creates a category', async () => {
		const cat = await dbconnection('categories').orderBy('id', 'desc').first();
		expect(cat).toBeDefined();
		if (cat) {
			// Make a shallow copy and set id to undefined to satisfy TypeScript
			const { id, ...catWithoutId } = cat;
			const response = await App.post(`/categories/`).send(catWithoutId);
			expect(response.status).eq(200);
			expect(response.body.id).not.eq(cat.id);
		}
	});
	it('updates category', async () => {
		const original = (
			await dbconnection('categories').insert(
				{
					color: '#848937',
					name: 'other than that',
					status: 'public',
				},
				'*'
			)
		).find(Boolean);
		const response = await App.put(`/categories/${original!.id}`).send({
			...original,
			color: '#000000',
		});
		expect(response.status).eq(200);
		expect(response.body.color).eq('#000000');
	});
	it('deletes a category but not from the database', async () => {
		const cat = await dbconnection('categories').orderBy('id', 'desc').first();
		expect(cat).toBeDefined();
		const response = await App.delete(`/categories/${cat!.id}`);
		expect(response.status).eq(200);
		const dbcat = await dbconnection('categories').where('id', cat!.id).first();
		expect(dbcat!.status).not.eq('public');
	});
});
