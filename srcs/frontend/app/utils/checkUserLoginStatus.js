import { callAPI } from "./callApiUtils.js";

const checkUserLoginStatus = function(callback) {
	callAPI("GET", "http://127.0.0.1:8000/api/auth/login_status", null, (res, data) => {
		if (!data || !res.ok)
			return ;
		const status = data.logged_in;
		callback(status);
	});
}

export default checkUserLoginStatus;