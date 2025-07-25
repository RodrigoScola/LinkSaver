import { ErrorHandler } from './ErrorHandling/ErrorHandler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasValidMessage(reason: any): reason is { message: string } {
	return reason && typeof reason === 'object' && 'message' in reason && typeof reason.message === 'string';
}

process.on('unhandledRejection', (reason: Error | unknown) => {
	if (hasValidMessage(reason)) {
		throw new Error(reason.message);
	}

	if (reason && typeof reason === 'string') throw new Error(reason);

	throw new Error('Unexpected Error');
});

process.on('uncaughtException', (error: Error) => {
	ErrorHandler.handle(error, undefined);
});
