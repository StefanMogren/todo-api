import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { authorizeKey } from '../middlewares/authorizeKey.js';
import { getUser, registerUser } from '../services/users.js';

const router = Router();

// router.use(authorizeKey);
// GET - Logga ut inloggad användare
// URL: /api/auth/logout
router.get('/logout', async (req, res, next) => {
	if (global.user) {
		global.user = null;
		res.json({
			success: true,
			message: 'User logged out successfully',
		});
	} else {
		next({
			status: 400,
			message: 'No user to logout',
		});
	}
});

// POST - Tar emot data i requestets body, jämför mot databasen och returnerar status baserat på utfall.
// URL: /api/auth/login
// Body: { "username" : [username], "password" : [password] }
router.post('/login', async (req, res, next) => {
	const { username, password } = req.body;

	if (!global.user) {
		if (username && password) {
			const user = await getUser(username);
			console.log(user);

			if (user) {
				if (user.password === password) {
					global.user = user;

					res.json({
						success: true,
						message: `User ${username} logged in successfully`,
					});
				} else {
					next({
						status: 400,
						message: 'Username or password are incorrect',
					});
				}
			} else {
				next({
					status: 400,
					message: 'No user found',
				});
			}
		} else {
			next({
				status: 400,
				message: 'Both username and password are required',
			});
		}
	} else {
		next({
			status: 400,
			message: `User ${global.user.username} is already logged`,
		});
	}
});

// POST - Tar emot data i requestets body, kontrollerar att användaren inte redan finns, och returnerar status.
// URL: /api/auth/register
// Body: { "username" : [username], "password" : [password] }
router.post('/register', async (req, res, next) => {
	const { username, password } = req.body;

	if (username && password) {
		const result = await registerUser({
			username: username,
			password: password,
			userId: uuid().substring(0, 5),
		});

		if (result) {
			res.status(201).json({
				success: true,
				message: `User ${username} created successfully`,
			});
		} else {
			next({
				status: 400,
				message: `Username ${username} already exist and could not be created.`,
			});
		}
	} else {
		next({
			status: 400,
			message: 'Both username and password are required.',
		});
	}
});

export default router;
