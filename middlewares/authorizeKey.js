import { isKeyInDatabase } from '../services/keys.js';

export async function authorizeKey(req, res, next) {
	const { key } = req.query;

	if (key) {
		const keyExists = await isKeyInDatabase(key);

		if (keyExists) {
			next();
		} else {
			next({
				status: 400,
				message: 'Invalid key',
			});
		}
	} else {
		next({
			status: 400,
			message: 'No key provided',
		});
	}
}
