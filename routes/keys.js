import { Router } from 'express';
import { getRandomKey } from '../services/keys.js';

const router = Router();

// GET - returnera slumpmässig nyckel
router.get('/', async (req, res, next) => {
	// Konstanten har namnet key här. Inuti finns ett objekt med nyckeln key.
	const key = await getRandomKey();

	if (key) {
		res.json({
			success: true,
			key: key.key,
		});
	} else {
		next({
			status: 404,
			message: 'No key found',
		});
	}
});

export default router;
