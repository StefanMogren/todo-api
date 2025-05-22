import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { authorizeKey } from '../middlewares/authorizeKey.js';
import { getUser } from '../services/users.js';
import Todo from '../models/todo.js';

const router = Router();

router.use(authorizeKey);

// GET - Returnerar alla todouppgifter som finns i databasen.
// URL: /api/todos
// Query: ?key=
router.get('/', async (req, res, next) => {
	const todos = await Todo.find();

	if (todos.length > 0) {
		res.json({
			success: true,
			todos: todos,
		});
	} else {
		next({
			status: 400,
			message: 'No todos available',
		});
	}
});

// GET - Tar emot ett användar-ID som parameter och returnerar alla todouppgifter som finns kopplade till användar-ID:t.
// URL: /api/todos/:userid
// Query: ?key=

// POST - Detta anrop kan endast göras om en användare är inloggad, annars returneras ett fel. Vid lyckat anrop så skapas en ny todo upp i databasen som kopplas ihop med den inloggade användaren genom dess användar-ID.
// URL: /api/todos
// Query: ?key=
// Body: { "task" : [task] }

// PUT - Detta anrop kan endast göras om en användare är inloggad, annars returneras ett fel. Vid lyckat anrop så togglas statusen "done" mellan true/false. En inloggad användare kan dessutom endast ändra status på sina egna todos.
// URL: /api/todos/:todoid
// Query: ?key=

// DELETE - Detta anrop kan endast göras om en användare är inloggad, annars returneras ett fel. Vid lyckat anrop så togglas statusen "done" mellan true/false. En inloggad användare kan dessutom endast ta bort sina egna todos.
// URL: /api/todos/:todoid
// Query: ?key=

export default router;
