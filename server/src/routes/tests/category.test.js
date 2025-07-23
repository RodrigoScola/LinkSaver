import { describe, it, expect }  from 'vitest';
import { App }  from '../../__tests__/vitest.setup'



describe('teste de rotas de categorias', () => {

    it('pega todas as categorias', async () => {

        const response = await App.get('/categories')

        expect(response.status).eq(200);

    })
})

