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
import checkUserLoginStatus from "../utils/checkUserLoginStatus.js";

//  /user/:id devo poder configurar neste formato
const routes = {
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


const render = function(page) {
	const app = document.querySelector("#app");
	const oldElm = app.querySelector("#app > div");
	const newElm = document.createElement("div");

	// pode ser colocado nos eventos globais e retirado daqui
	stateManager.addEvent("pageReady", (state) => {
		if (state) {
			stateManager.setState("pageReady", false);
			if (!oldElm)
				app.appendChild(newElm);
			else
				app.replaceChild(newElm, oldElm);
		}
	});

	newElm.innerHTML = `<${page}></${page}>`;
}
  
const getPageName = function() {
	let route = getCurrentRoute();
	if (route.length === 0)
		route = "/";

	const pageName = routes[route];
	if (pageName)
		return pageName;
	else
		return Page404.componentName;
}

export const router = function() {
	checkUserLoginStatus((status) => {
		if (status === false)
			stateManager.setState("isLoggedIn", false);
		stateManager.cleanEvents();
		render(getPageName());
	});
}

export const setHistoryEvents = function() {
	window.addEventListener("popstate", (event) => {
		router();
	});
}

const updateRoute = function(route) {
	history.pushState({route: route}, null, route);
}

const getCurrentRoute = function() {
	return window.location.pathname.replace(/\/+(?=\/|$)/g, '');
}

const getLastRoute = function() {
	return history.state ? history.state.route : null;
}
export const redirect = function(route) {
	if (!route)
		console.log(`Error: Redirection Failed`);
	else {
		updateRoute(route);
		router();
	}
}


stateManager.addEvent("isLoggedIn", (state) => {
	if (state == false) {
		console.log(`getCurrentRoute: ${getCurrentRoute()}`);
		if (!publicRoutes.includes(getCurrentRoute()))
			redirect(initialRoute);
	}
});


// contabilizar com página 404
// Não pode aceder ha rota signin ou signup se estiver logado
// Se não estiver logado tem de poder aceder a todas as rotas publicas.
/*
stateManager.addEvent("isLoggedIn", (state) => {
	if (state == false) {
		console.log(`getCurrentRoute: ${getCurrentRoute()}`);
		console.log(`getLastRoute: ${getLastRoute()}`);


	}
});
*/