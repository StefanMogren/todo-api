import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
		unique: true,
	},
});

const User = mongoose.model('User', userSchema);

export default User;
