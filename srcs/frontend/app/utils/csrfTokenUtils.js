import { callAPI } from "./callApiUtils.js";
import stateManager from "../js/StateManager.js";

export const getCsrfTokenFromApi = function() {
	callAPI("GET", "http://127.0.0.1:8000/api/auth/get-csrf-token", null, null);
}

export const getCsrfToken = function() {
	let token = null;
	const csrfTokenName = 'csrftoken';
	const cookies = document.cookie.split(';');

	cookies.forEach((cookie) => {
		cookie = cookie.trim();
		if (cookie.startsWith(`${csrfTokenName}=`))
			token = cookie.substring(csrfTokenName.length + 1);
	})
	return token;
}