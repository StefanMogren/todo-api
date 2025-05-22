import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import keysRouter from './routes/keys.js';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

// Middlewares
app.use(express.json());
// app.use(logger)

// Routes
app.use('/api/keys', keysRouter);

database.on('error', (error) => console.log(error));
database.once('connected', () => {
	console.log('Database connected');

	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
