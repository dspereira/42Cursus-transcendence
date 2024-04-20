import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";

let routeEvents = [];

const routes = {
	"/"				: PageLogin.componentName,
	"/index.html"	: PageLogin.componentName,
	"/login"		: PageLogin.componentName,
	"/signup"		: PageSignup.componentName
}

const removeRouteEvents = function(){
	routeEvents.forEach(function(elm) {
		elm.removeEventListener("click", routeLinkEventHandeler);
	});
	routeEvents = [];
}


const getPage = function (url) {
	return routes[url];
}

const render = function(page) {
	document.querySelector("#app").innerHTML = `<${page}></${page}>`;
}

const router = function(newRoute) {
	const route = newRoute || location.pathname;

	console.log("Page routed");
	history.pushState({route: route}, null, route);
	render(getPage(route));
	removeRouteEvents();
	setAllRouteEvents();
}

const routeLinkEventHandeler = function(event) {
	event.preventDefault();
	router(this.getAttribute('href'));
}

// adicionar e remover os eventos para não causar problemas de eventos repetidos
const setAllRouteEvents = function(){
	const link = document.querySelector('a[href]');

	link.addEventListener('click', routeLinkEventHandeler);
	routeEvents.push(link)

	console.log(routeEvents);
	window.onpopstate = function(event)
	{
		console.log(`onpopstate: ${event.state.route}`);
		if (event.state.route)
			router(event.state.route);
	}
}


/*
const setAllRouteEvents = function(){
	const links = document.querySelectorAll('a[href]');

	links.forEach(link => {
		const newRoute = link.innerHTML;
		link.addEventListener('click', function(event) {
			event.preventDefault();
			history.pushState({route: newRoute}, null, newRoute);
			router();
			console.log(`new event link ${newRoute}`);
		});
	});
}
*/

document.addEventListener('DOMContentLoaded', () => {
	router(location.pathname)
});
