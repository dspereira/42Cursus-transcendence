import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";
import Page404 from "../page-components/page-404.js";


//  /user/:id devo poder configurar neste formato
const routes = {
	"/"				: PageLogin.componentName,
	"/index.html"	: PageLogin.componentName,
	"/login"		: PageLogin.componentName,
	"/signup"		: PageSignup.componentName,
}

const render = function(page) {
	document.querySelector("#app").innerHTML = `<${page}></${page}>`;
}

const getPageName = function() {
	let route = location.pathname.replace(/\/+(?=\/|$)/g, '');
	if (route.length === 0)
		route = "/";

	const pageName = routes[route];
	if (pageName)
		return pageName;
	else
		return Page404.componentName;
}

const router = function() {
	render(getPageName());
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