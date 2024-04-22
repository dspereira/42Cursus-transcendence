import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";

const routes = {
	"/"				: PageLogin.componentName,
	"/index.html"	: PageLogin.componentName,
	"/login"		: PageLogin.componentName,
	"/signup"		: PageSignup.componentName
}

const render = function(page) {
	document.querySelector("#app").innerHTML = `<${page}></${page}>`;
}

const router = function() {
	console.log(`route to ${location.pathname}`);
	render(routes[location.pathname]);
	setAllRouteEvents();
}

const routeEventHandler = function(event) {
	event.preventDefault();
	const route = this.getAttribute('href');
	history.pushState({route: route}, null, route);
	router();
}

const setAllRouteEvents = function(){
	document.querySelector('a[href]').addEventListener('click', routeEventHandler);
}

const setHistoryEvents = function()
{
	window.addEventListener("popstate", (event) => {
		router();
	});
}

document.addEventListener('DOMContentLoaded', () => {
	router();
	setHistoryEvents();
});