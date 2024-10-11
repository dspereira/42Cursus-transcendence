import { callAPI } from "./callApiUtils.js";
import stateManager from "../js/StateManager.js";

const updateUserStates = function(data) {
	let id = null;
	let username = null;

	if (data && data.id)
		id = data.id;
	if (data && data.username)
		username = data.username;
	stateManager.setState("userId", id);
	stateManager.setState("username", username);
}

const checkUserLoginState = function(callback) {
	callAPI("GET", "/auth/login_status", null, (res, data) => {
		updateUserStates(data);
		if (callback && res && res.ok && data)
			callback(data.logged_in);
		else if (callback)
			callback(false);
	});
}

export default checkUserLoginState;