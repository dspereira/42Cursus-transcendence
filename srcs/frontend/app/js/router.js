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
	let route = location.pathname.replace(/\/+(?=\/|$)/g, '');
	if (route.length === 0)
		route = "/";

	const pageName = routes[route];
	if (pageName)
		return pageName;
	else
		return Page404.componentName;
}

export const router = function() {
	stateManager.cleanEvents();
	render(getPageName());
}

export const setHistoryEvents = function() {
	window.addEventListener("popstate", (event) => {
		router();
	});
}

export const redirect = function(route) {
	if (!route)
		console.log(`Error: Redirection Failed`);
	else {
		history.pushState({route: route}, null, route);
		router();
	}
}
