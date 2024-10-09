import { callAPI } from "./callApiUtils.js";
import stateManager from "../js/StateManager.js";

const getCsrfToken = function() {
	callAPI("GET", "http://127.0.0.1:8000/api/auth/get-csrf-token", null, (res, resData) => {
		if (res.ok && resData)
			stateManager.setState("csrfToken", resData.csrfToken);
	})
}

export default getCsrfToken;