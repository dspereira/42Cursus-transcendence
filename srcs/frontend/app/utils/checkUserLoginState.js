import { callAPI } from "./callApiUtils.js";

const checkUserLoginState = function(callback) {
	callAPI("GET", "http://127.0.0.1:8000/api/auth/login_status", null, (res, data) => {
		if (!data || !res.ok)
			return ;
		const state = data.logged_in;
		const userId = data.id
		if (callback)
			callback(state, userId);
	});
}

export default checkUserLoginState;