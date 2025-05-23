import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const todoSchema = new Schema(
	{
		task: {
			type: String,
			minlength: 6,
			required: true,
		},
		done: {
			type: Boolean,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		todoId: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
