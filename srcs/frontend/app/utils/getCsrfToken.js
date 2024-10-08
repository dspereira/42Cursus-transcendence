import {callAPI} from "./callApiUtils.js";

const getCsrfToken = function(data) {
	callAPI("GET", "http://127.0.0.1:8000/api/auth/get-csrf-token", null, (res, resData) => {
		if (res.ok && resData) {
			data["csrfToken"] = resData.csrfToken;
		}
	})
}

export default getCsrfToken;