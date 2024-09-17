import { redirect } from "../js/router.js";
import { callAPI } from "./callApiUtils.js";

const friendProfileRedirectionEvent = function(html, elmSelector, userId) {
	if (!html || !elmSelector || !userId)
		return ;
	const elm = html.querySelector(`${elmSelector}`);
	 if (!elm)
		 return ;
	elm.addEventListener("click", () => {
		callAPI("GET", `http://127.0.0.1:8000/api/profile/username/?id=${userId}`, null, (res, data) => {
			if (res.ok && data && data.username)
				redirect(`/profile/${data.username}`);
		});
	});
}

export default friendProfileRedirectionEvent;