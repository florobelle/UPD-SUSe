import { readUserInfo } from '$lib/server/User.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    // Requests lib user info
	const filter = await request.json();
	return json(await readUserInfo(filter));
}