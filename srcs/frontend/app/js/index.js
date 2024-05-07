import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";

const routes = {
	"/index.html"	: PageLogin.componentName, // test route for develop in liveserver vscode
	"/login"		: PageLogin.componentName,
	"/signup"		: PageSignup.componentName
}

const getPage = function (url) {
	return routes[url];
}

const render = function(page) {
	const app = document.querySelector("#app");
	app.innerHTML = `<${page}></${page}>`;
}

const router = function(newRoute) {
	const route = newRoute || location.pathname;

	history.pushState({route: route}, null, route);
	render(getPage(route));
	setAllRouteEvents();
}


// adicionar e remover os eventos para não causar problemas de eventos repetidos
const setAllRouteEvents = function(){
	const link = document.querySelector('a[href]');
	const newRoute =  link.getAttribute('href');

	//link.removeEventListener('click');

	link.addEventListener('click', function(event) {
		event.preventDefault();
		router(newRoute);
		console.log(`new event link ${newRoute}`);
	});

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


//router
//const router1 = function()
//{
//}

//render("/login");
//render("/signup");


/*
document.addEventListener('DOMContentLoaded', function() {

	let link = document.querySelector('a[href]');

	link.addEventListener('click', function(event) {
		event.preventDefault();
		history.pushState({route: `/sadsfsdfdfg`}, null, `/sadsfsdfdfg`);
		console.log(`Location: ${location.pathname}`);
		
	});

	window.onpopstate = function(event)
	{
		console.log(event.state.route);
		console.log(`Location onpop: ${location.pathname}`);
	}

});
*/