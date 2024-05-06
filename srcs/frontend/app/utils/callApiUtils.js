export const callAPI = async function (method, url, data, callback_sucess, callback_error) {
	try {
		const res = await fetch(url, getReqHeader(method, data));
		const resData = await res.json();
		if (callback_sucess)
			callback_sucess(res, resData);
		else
			console.log(resData);
	}
	catch (error) {
		if (callback_error)
			callback_error(error);
		else
			console.log(error);
	}
}

const getReqHeader = function(method, data)
{
	const obj = {
		credentials: 'include',
	};

	if (method)
		obj.method = method;
	else
		obj.method = "GET";
	if (data) {
		obj.headers = {
			"Content-Type": "application/json"
		}
		obj.body = JSON.stringify(data);
	}
	return obj;
}
