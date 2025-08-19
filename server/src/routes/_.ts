import express from 'express';
import { getLinkPreview } from 'link-preview-js';

const utilRouter = express.Router();

utilRouter.get('/getPreview', async (req, res) => {
	console.log('getting preview', req.query.url);
	try {
		const url = new URL(req.query.url as string);

		const data = await getLinkPreview(url.href);
		return res.json(data);
	} catch (err) {
		return;
	}
});

export default utilRouter;
