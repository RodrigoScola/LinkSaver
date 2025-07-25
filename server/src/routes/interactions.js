import express from 'express';
// import { interactionsTable } from "../datbase/InteractionsTable.js"
// import { postTable } from "../datbase/PostTable.js"
// import { RangeQueryType } from "../datbase/Query.js"

const interactionsRouter = express.Router();

interactionsRouter.use('/:postId/:userId', async (req, res, next) => {
	// const data = await interactionsTable.get_interaction('all', req.params.userId, req.params.postId);
	// if (data) {
	// 	req.post = data;
	// 	return next();
	// } else {
	// 	res.sendStatus(404);
	// }
});

interactionsRouter.post('/:postId/:userId', async (req, res, next) => {
	// try {
	// 	const type = req.body.type;
	// 	// const data = await interactionsTable.interactionHandler("like", req.params.userId, req.params.postId)
	// 	const data = await interactionsTable.interactionHandler(type, req.params.userId, req.params.postId);
	// 	res.send(data);
	// } catch (err) {
	// 	next(err);
	// }
});
interactionsRouter.get('/posts', async (req, res, next) => {
	// if (!req.queryOptions) {
	// 	return next();
	// }
	// let options = [new RangeQueryType(0, 10), ...req.queryOptions];
	// let recentPosts = await interactionsTable.get_posts(options);
	// const ids = recentPosts.reduce((curr, item) => {
	// 	curr.push(item.post_id);
	// 	return curr;
	// }, []);
	// const dat = await Promise.all(ids.map((id) => postTable.get_by_id(id)));
	// res.send(dat);
});
interactionsRouter.get('/:postId/:userId', (req, res) => {
	// res.send(req.post);
});

interactionsRouter.use((err, req, res, next) => {
	// const status = err.status || 500;
	// res.status(status).send(err.message);
});

export default interactionsRouter;
