import Todo from '../models/todo.js';

export async function createNewTodo(todo) {
	try {
		const result = await Todo.create(todo);
		return result;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}

export async function getAllTodos() {
	try {
		const todos = await Todo.find();
		return todos;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}

export async function getTodosByUserId(userId) {
	try {
		const todos = await Todo.find({
			userId: userId,
		});
		if (todos.length < 1) {
			throw new Error('No todos found');
		} else {
			return todos;
		}
	} catch (error) {
		console.log(error.message);
		return null;
	}
}

export async function updateTodo(todoId) {
	try {
		const result = await Todo.findOneAndUpdate(
			{ todoId: todoId },
			[
				{
					$set: {
						done: { $not: '$done' },
					},
				},
			],
			{ new: true }
		);
		return result;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}

export async function findTodoByTodoId(todoId) {
	try {
		const result = await Todo.findOne({
			todoId: todoId,
		});
		return result;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}

export async function deleteTodo(todoId) {
	try {
		const result = await Todo.findOneAndDelete({
			todoId: todoId,
		});
		return result;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}
