import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";
import updateLoggedInStatus from "./updateLoggedInUtils.js";
import { render } from "../js/router.js";
import { getHtmlElm } from "./getHtmlElmUtils.js";
import PageError from "../page-components/page-error.js";
import DOMAIN from "../js/domain.js";

const API_ROUTE 		= `https://${DOMAIN}/api`;
const REFRESH_URL		= `${API_ROUTE}/auth/refresh_token`;
const HEALTH_CHECK_URL		= `${API_ROUTE}/check/`;
const REFRESH_METHOD	= `POST`;

const publicRoutes = [
	`${API_ROUTE}/auth/login`,
	`${API_ROUTE}/auth/register`,
	`${API_ROUTE}/auth/validate-email`,
	`${API_ROUTE}/auth/resend-email-validation`,
	`${API_ROUTE}/two-factor-auth/configured-2fa`,
	`${API_ROUTE}/two-factor-auth/request-email`,
	`${API_ROUTE}/two-factor-auth/request-phone`,
	`${API_ROUTE}/two-factor-auth/validate-otp`,
];

export const callAPI = async function (method, url, data, callback_sucess, callback_error, csrf_token) {
	const isLoggedIn = stateManager.getState("isLoggedIn");
	url = `${API_ROUTE}${url}`;
	let resApi = await fetchApi(method, url, data, csrf_token);

	// isLoggedIn != false -> because when the page is refreshed, the state is null, and it needs to check if a refresh token exists
	if (isLoggedIn != false && resApi && !resApi.error && resApi.data && resApi.res) {
		if (resApi.res.status == 401) {
			let resRefresh = await fetchApi(REFRESH_METHOD, REFRESH_URL, null, csrf_token);
			if (resRefresh && resRefresh.res && resRefresh.res.ok) {
				stateManager.setState("hasRefreshToken", true);
				stateManager.setState("hasRefreshToken", false);
				chatWebSocket.close();
			}
			resApi = await fetchApi(method, url, data, csrf_token);
		}
	}
	if (resApi && !resApi.error && callback_sucess) {
		callback_sucess(resApi.res, resApi.data);
		if (resApi.res && resApi.res.status == 401)
			updateLoggedInStatus(false);
		else if (isLoginRequiredRoute(url))
			updateLoggedInStatus(true);
	}
	else if (resApi && resApi.error) {
		if (callback_error)
			callback_error(resApi.error);
		else {
			console.log(`callAPI Error: ${resApi.error}`);
			if (navigator.onLine) {
				let checkRes = await fetchApi("GET", HEALTH_CHECK_URL, null);
				if (checkRes.error)
					render(getHtmlElm(PageError));
			}
		}
	}	
}

const fetchApi = async function (method, url, data, csrf_token) {
	let res = null;
	let resData = null;
	let callError = null;
	
	try {
		res = await fetch(url, getReqHeader(method, data, csrf_token));
		let contentLength = res.headers.get('content-length');
		if (contentLength && contentLength != "0")
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

const getReqHeader = function(method, data, csrf_token) {
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
			obj.headers = {
				"Content-Type": "application/json"
			};
			obj.body = JSON.stringify(data);
		}
	}
	if (obj.method != "GET" && csrf_token) {
		if (obj.headers)
			obj.headers["X-CSRFToken"] = csrf_token;
		else
			obj.headers = {"X-CSRFToken" : csrf_token};
	}
	return obj;
}

const isLoginRequiredRoute = function (url) {
	const lastCharIdx = url.length - 1; 
	if (url[lastCharIdx] == '/')
		url = url.slice(0, lastCharIdx);

	if (publicRoutes.includes(url))
		return false;
	return true;
}
