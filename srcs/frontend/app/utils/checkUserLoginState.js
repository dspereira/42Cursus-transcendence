import { callAPI } from "./callApiUtils.js";
import stateManager from "../js/StateManager.js";

const checkUserLoginState = function(callback) {
	callAPI("GET", "http://127.0.0.1:8000/api/auth/login_status", null, (res, data) => {
		if (!data || !res.ok)
			return ;
		stateManager.setState("userId", data.id);
		stateManager.setState("username", data.username);
		if (callback)
			callback(data.logged_in);
	});
}

export default checkUserLoginState;