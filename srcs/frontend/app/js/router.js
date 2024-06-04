// Pages
import PageHome from "../page-components/page-home.js";
import PageProfile from "../page-components/page-profile.js";
import PageChat from "../page-components/page-chat.js";
import PageTournaments from "../page-components/page-tournaments.js";
import PageNotifications from "../page-components/page-notifications.js";
import PageConfigs from "../page-components/page-configs.js";
import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";
import Page404 from "../page-components/page-404.js";

// Components
import AppTest from "../components/app-test.js";
import AppHeader from "../components/app-header.js";
import LoginForm from "../components/login-form.js";
import SignupForm from "../components/signup-form.js";
import SidePanel from "../components/side-panel.js";
import AppChat from "../components/app-chat.js";
import MsgCard from "../components/msg-card.js";

// Others
import stateManager from "./StateManager.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";

//  /user/:id devo poder configurar neste formato
const routes = {
	//""					: PageHome.componentName,
	"/"					: PageHome.componentName,
	"/index.html"		: PageHome.componentName,
	"/login"			: PageLogin.componentName,
	"/signup"			: PageSignup.componentName,
	"/profile"			: PageProfile.componentName,
	"/chat"				: PageChat.componentName,
	"/tournaments"		: PageTournaments.componentName,
	"/notifications"	: PageNotifications.componentName,
	"/configurations"	: PageConfigs.componentName
}

const publicRoutes = ["/login", "/signup"];
const initialRoute = "/login";

//let firtTime = true;

const render = function(page) {
	const app = document.querySelector("#app");
	const oldElm = app.querySelector("#app > div");
	const newElm = document.createElement("div");
	
	stateManager.addEvent("pageReady", (state) => {
		if (state) {
			console.log("page ready");
			stateManager.setState("pageReady", false);
			if (!oldElm)
				app.appendChild(newElm);
			else
				app.replaceChild(newElm, oldElm);
		}
	});

	newElm.innerHTML = `<${page}></${page}>`;
}

const getPageName = function(route) {
	let pageName = null;

	console.log("getPageName Route: ", route);
	console.log("getPageName Routes: ", routes[route]);


	if (route)
		pageName = routes[route];
	else
		pageName = routes[getCurrentRoute()];

	if (pageName)
		return pageName;
	else
		return Page404.componentName;
}

const updateIsLoggedInState = function(state) {
	if (state != stateManager.getState("isLoggedIn")) {
		stateManager.setState("isLoggedIn", state);
	}
}

const getRouteByPermissions = function(route, isLoggedIn) {
	
	console.log(`----------${route}----------`)
	if (isLoggedIn) {
		if (publicRoutes.includes(route))
			return "/";
	}
	else {
		if (!publicRoutes.includes(route) && routes[route])
			return initialRoute;
	}
	console.log(`#########${route}########`)
	return route;
}


let init = true;
export const router = function(route) {
	stateManager.cleanEvents();
	checkUserLoginState((state) => {
		if (!route)
			route = getCurrentRoute();
		const newRoute = getRouteByPermissions(route, state);

		console.log("New route: ", newRoute);

		if (!init)
			updateRoute(newRoute);
		render(getPageName(newRoute));


		/*updateRoute(getRouteByPermissions(route, state));
		render(getPageName());*/
		updateIsLoggedInState();
		init = false;
	});
}

const routingHistory = function() {
	stateManager.cleanEvents();
	checkUserLoginState((state) => {
		let newRoute = getRouteByPermissions(getCurrentRoute(), state);
		console.log(window.location);
		render(getPageName(newRoute));
		updateIsLoggedInState();
	});
}

export const setHistoryEvents = function() {
	window.addEventListener("popstate", (event) => {
		routingHistory();
	});
}

const updateRoute = function(route) {
	window.history.pushState({route: route}, null, route);
}

const getCurrentRoute = function() {
	let route = window.location.pathname.replace(/\/+(?=\/|$)/g, '');
	if (!route)
		route = "/";

	console.log(`getCurrent Route :${route}`);
	return route;
}

export const redirect = function(route) {
	if (!route)
		console.log(`Error: Redirection Failed`);
	else {
		router(route);
	}
}

// criar funçao que verifica se rota existe procura com / e sem /

stateManager.addEvent("isLoggedIn", (state) => {
	if (state == false) {
		console.log(`getCurrentRoute: ${getCurrentRoute()}`);
		if (!publicRoutes.includes(getCurrentRoute()))
			redirect(initialRoute);
	}
});
