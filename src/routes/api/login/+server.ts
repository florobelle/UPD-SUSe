import { readUsername } from '$lib/server/User.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	// Requests user login info
	const { rfid } = await request.json();
	return json(await readUsername(rfid));
}