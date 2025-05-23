import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { authorizeKey } from '../middlewares/authorizeKey.js';
import { getUser } from '../services/users.js';
import Todo from '../models/todo.js';
import {
	getAllTodos,
	createNewTodo,
	getTodosByUserId,
	updateTodo,
	deleteTodo,
	findTodoByTodoId,
} from '../services/todos.js';

const router = Router();

router.use(authorizeKey);

// GET - Returnerar alla todouppgifter som finns i databasen.
// URL: /api/todos
// Query: ?key=
router.get('/', async (req, res, next) => {
	const todos = await getAllTodos();

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
router.get('/:userid', async (req, res, next) => {
	const userId = req.params.userid;

	const result = await getTodosByUserId(userId);

	if (result) {
		res.json({
			success: true,
			todos: result,
		});
	} else {
		next({
			status: 400,
			message: `No todos found by userId ${userId}`,
		});
	}
});

// POST - Detta anrop kan endast göras om en användare är inloggad, annars returneras ett fel. Vid lyckat anrop så skapas en ny todo upp i databasen som kopplas ihop med den inloggade användaren genom dess användar-ID.
// URL: /api/todos
// Query: ?key=
// Body: { "task" : [task] }
router.post('/', async (req, res, next) => {
	if (global.user) {
		const { task } = req.body;

		if (task) {
			const newTodo = await createNewTodo({
				task: task,
				done: false,
				userId: global.user.userId,
				todoId: uuid().substring(0, 5),
			});

			res.status(201).json({
				success: true,
				message: 'New todo created successfully',
			});
		} else {
			next({
				status: 400,
				message: 'Task is required',
			});
		}
	} else {
		next({
			status: 400,
			message: 'A user must be logged in',
		});
	}
});

// PUT - Detta anrop kan endast göras om en användare är inloggad, annars returneras ett fel. Vid lyckat anrop så togglas statusen "done" mellan true/false.
// URL: /api/todos/:todoid
// Query: ?key=
router.put('/:todoid', async (req, res, next) => {
	// ----- Om en användare är inloggad -----
	if (global.user) {
		const todoId = req.params;

		const result = await updateTodo(todoId.todoid);

		// ----- Om det finns en todo med todoId -----
		if (result) {
			// ----- Om userId i todo matchar användarens userId -----
			if (result.userId === global.user.userId) {
				res.json({
					success: true,
					message: `Todo status changed to ${result.done}`,
				});
			} else {
				next({
					status: 405,
					message: `User ${global.user.username} may not change this post`,
				});
			}
		} else {
			next({
				status: 400,
				message: 'No todo found',
			});
		}
	} else {
		next({
			status: 400,
			message: 'A user must be logged in',
		});
	}
});

// DELETE - Detta anrop kan endast göras om en användare är inloggad, annars returneras ett fel. En inloggad användare kan dessutom endast ta bort sina egna todos.
// URL: /api/todos/:todoid
// Query: ?key=
router.delete('/:todoid', async (req, res, next) => {
	// ----- Om en användare är inloggad -----
	if (global.user) {
		const todoId = req.params.todoid;
		const todoExist = await findTodoByTodoId(todoId);

		// ----- Om todo med todoId existerar -----
		if (todoExist) {
			// ----- Om todons userId matchar användarens userId -----
			if (todoExist.userId === global.user.userId) {
				const result = await deleteTodo(todoId);

				// ----- Om raderingen fungerade -----
				if (result) {
					res.json({
						success: true,
						message: 'Todo deleted successfully',
					});
				} else {
					next({
						status: 400,
						message: 'Failed to delete todo',
					});
				}
			} else {
				next({
					status: 405,
					message: 'User may not delete this todo',
				});
			}
		} else {
			next({
				status: 400,
				message: 'Todo does not exist',
			});
		}
	} else {
		next({
			status: 400,
			message: 'User must be logged in',
		});
	}
});

export default router;
