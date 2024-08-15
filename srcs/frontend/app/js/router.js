// Pages
import PageHome from "../page-components/page-home.js";
import PageProfile from "../page-components/page-profile.js";
import PageChat from "../page-components/page-chat.js";
//import PageTournaments from "../page-components/page-tournaments_old.js";
import  PageTournaments from "../page-components/page-tournaments.js";
import PageNotifications from "../page-components/page-notifications.js";
import PageConfigs from "../page-components/page-configs.js";
import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";
import Page404 from "../page-components/page-404.js";
import PageInitial from "../page-components/page-initial.js";
import PageLogout from "../page-components/page-logout.js";
import PageFriends from "../page-components/page-friends.js";
import PagePlay from "../page-components/page-play.js";
import PageGame from "../page-components/page-game.js";

// Components
import AppHeader from "../components/app-header.js";
import LoginForm from "../components/login-form.js";
import SignupForm from "../components/signup-form.js";
import SidePanel from "../components/side-panel.js";
import AppChat from "../components/app-chat.js";
import MsgCard from "../components/msg-card.js";
import AppFriends from "../components/app-friends.js";
import UserCard from "../components/user-card.js";
import ChatFriendsList from "../components/chat-friends-list.js";
import ChatSection from "../components/chat-section.js";
import AppPlay from "../components/app-play.js";
import GameInviteRequest from "../components/game-invite-request.js";
import GameInviteCard from "../components/game-invite-card.js";
import GameInviteSend from "../components/game-invite-send.js";
import GameInviteCard1 from "../components/game-invite-card1.js";
import AppLobby from "../components/app-lobby.js";
import TourneyGraph from "../components/tourney-graph.js";
import TourneyLobby from "../components/tourney-lobby.js";
import TourneyInviter from "../components/tourney-inviter.js";

// Others
import stateManager from "./StateManager.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";

//  /user/:id devo poder configurar neste formato
//  /play/:id devo poder configurar neste formato
const routes = {
	//""					: PageHome.componentName,
	"/initial"			: PageInitial.componentName,
	"/"					: PageHome.componentName,
	//"/index.html"		: PageHome.componentName,
	"/login"			: PageLogin.componentName,
	"/signup"			: PageSignup.componentName,
	"/logout"			: PageLogout.componentName,
	"/profile"			: PageProfile.componentName,
	"/chat"				: PageChat.componentName,
	"/tournaments"		: PageTournaments.componentName,
	"/notifications"	: PageNotifications.componentName,
	"/configurations"	: PageConfigs.componentName,
	"/friends"			: PageFriends.componentName,
	"/play"				: PagePlay.componentName,
	"/game"				: PageGame.componentName,
}

const publicRoutes = ["/initial", "/login", "/signup"];
const initialRoute = "/initial";

const render = function(page) {
	const app = document.querySelector("#app");
	const oldElm = app.querySelector("#app > div");
	const newElm = document.createElement("div");
	
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

const getPageName = function(route) {
	let pageName = null;

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
	if (state === undefined || state === null)
		return ;
	if (state != stateManager.getState("isLoggedIn")) {
		stateManager.setState("isLoggedIn", state);
	}
}

const getRouteByPermissions = function(route, isLoggedIn) {
	if (isLoggedIn) {
		if (publicRoutes.includes(route))
			return "/";
	}
	else {
		if (!publicRoutes.includes(route) && routes[route])
			return initialRoute;
	}
	return route;
}

const normalizeRouteForHistory = function(route) {
	if (route === "/initial")
		return "/";
	return route; 
}

const normalizeRoute = function(route) {
	if (!route)
		route = "/";
	else if (route === "")
		route = "/";
	else if (route[0] != '/')
		route = `/${route}`;
	return route;
}

let init = true;
export const router = function(route) {
	stateManager.cleanEvents();
	checkUserLoginState((state, userId) => {
		if (!route)
			route = getCurrentRoute();
		route = normalizeRoute(route);
		const authorizedRoute = getRouteByPermissions(route, state);
		if (init)
			replaceCurrentRoute(normalizeRouteForHistory(authorizedRoute));
		else
			pushNewRoute(normalizeRouteForHistory(authorizedRoute));
		render(getPageName(authorizedRoute));
		updateIsLoggedInState(state);
		stateManager.setState("userId", userId);
		init = false;
	});
}

const routingHistory = function() {
	stateManager.cleanEvents();
	checkUserLoginState((state) => {
		const authorizedRoute = getRouteByPermissions(getCurrentRoute(), state);
		replaceCurrentRoute(normalizeRouteForHistory(authorizedRoute));
		render(getPageName(authorizedRoute));
		updateIsLoggedInState(state);
	});
}

export const setHistoryEvents = function() {
	window.addEventListener("popstate", (event) => {
		routingHistory();
	});
}

const pushNewRoute = function(route) {
	window.history.pushState({route: route}, null, route);
}

const replaceCurrentRoute = function(route) {
	window.history.replaceState({route: route}, null, route);
}

const getCurrentRoute = function() {
	let route = window.location.pathname.replace(/\/+(?=\/|$)/g, '');
	return normalizeRoute(route);
}

export const redirect = function(route) {
	if (!route)
		console.log(`Error: Redirection Failed`);
	else {
		router(route);
	}
}

stateManager.addEvent("isLoggedIn", (state) => {
	if (state == false) {
		if (!publicRoutes.includes(getCurrentRoute()))
			redirect(initialRoute);
	}
});
