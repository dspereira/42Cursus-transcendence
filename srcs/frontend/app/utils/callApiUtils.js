import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";
import updateLoggedInStatus from "./updateLoggedInUtils.js";

const refreshUrl = "http://127.0.0.1:8000/api/auth/refresh_token";
const refreshMethod = "POST";

export const callAPI = async function (method, url, data, callback_sucess, callback_error) {
	let resApi = await fetchApi(method, url, data);

	if (!resApi.error && resApi.data && resApi.res) {
		if (resApi.res.status == 401) {
			let resRefresh = await fetchApi(refreshMethod, refreshUrl, null);
			if (resRefresh && resRefresh.res && resRefresh.res.ok) {
				stateManager.setState("hasRefreshToken", true);
				stateManager.setState("hasRefreshToken", false);
				chatWebSocket.close();
				resApi = await fetchApi(method, url, data);
			}
		}
	}
	if (resApi && !resApi.error && callback_sucess) {
		callback_sucess(resApi.res, resApi.data);
		if (resApi.res && resApi.res.status == 401)
			updateLoggedInStatus(false);
		else if (resApi.res && resApi.res.ok)
			updateLoggedInStatus(true);
	}
	else if (resApi && resApi.error) {
		if (callback_error)
			callback_error(resApi.error);
		else
			console.log(`callAPI Error: ${resApi.error}`);
	}		
}

const fetchApi = async function (method, url, data) {
	let res = null;
	let resData = null;
	let callError = null;
	
	try {
		res = await fetch(url, getReqHeader(method, data));
		resData = await res.json();
	}
	catch (error) {
		callError = error;
	}
	return {
		res: res,
		data: resData,
		error: callError,
	}
}

const getReqHeader = function(method, data) {
	const isFormData = data instanceof FormData;

	const obj = {
		credentials: 'include',
	}
	if (method)
		obj.method = method;
	else
		obj.method = "GET";
	if (data) {
		if (isFormData)
			obj.body = data;
		else {
			obj.headers = {"Content-Type": "application/json"}
			obj.body = JSON.stringify(data);
		}
	}
	return obj;
}