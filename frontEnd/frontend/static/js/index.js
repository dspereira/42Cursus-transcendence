import DashBoard from "./views/DashBoard.js";
import Posts from "./views/Posts.js";
import postView from "./views/PostView.js";
import Settings from "./views/Settings.js";
import Game from "./views/Game.js";

const	pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
// returns the value at index one from the pathToRegex function e.g: posts/_2_
const getParams = match => {
	const values = match.result.slice(1); 
	const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]); // matches the id (posts/:id) and put it into the array

	return Object.fromEntries(keys.map((key, i) => {
		return [key, values[i]];
	}));
};

const navigateTo = url => 
{
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: DashBoard },
		{ path: "/posts", view: Posts },
		{ path: "/posts/:id", view: postView },
		{ path: "/settings", view: Settings },
		{ path: "/game", view: Game}
	];

	//test each route for pontential match
	const potentialMatches = routes.map(route => 
	{
		return {
			route: route,
			result: location.pathname.match(pathToRegex(route.path))
		};
	});
	let match = potentialMatches.find(potentialMatch => potentialMatch.result);

	if (!match) 
	{
		match = {
			route: routes[0], //This sets the error (in() => console.log("Viewing DashBoard")  case no path is found) to the dashboard, which can be also customized to a personalized 404 page
			result: [location.pathname]
		};
	}

	const view = new match.route.view(getParams(match));

	document.querySelector("#app").innerHTML = await view.getHtml();
};


window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => 
{
	document.body.addEventListener("click", e => 
	{
		if (e.target.matches("[data-link]")) 
		{
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});
	router();
});
