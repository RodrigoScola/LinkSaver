export class RequestError {
    static json(req: { url: string }, err: unknown) {
        return JSON.stringify({
            url: req.url,
            message: err,
        });
    }
}
