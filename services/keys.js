import Key from '../models/key.js';

export async function getRandomKey() {
	try {
		// Använder funktion från Mongoose att leta genom alla dokument i "Keys"-collection. Då genom att matcha mot den keySchema-modell som definierats innan.
		// Returnerar en array med samtliga keys.
		const keys = await Key.find();

		if (keys.length < 1) {
			throw new Error('No keys found in collection');
		} else {
			// Returnerar en slumpmässig nyckel från arrayen
			return keys[Math.floor(Math.random() * keys.length)];
		}
	} catch (error) {
		console.log(error.message);
		return null;
	}
}
