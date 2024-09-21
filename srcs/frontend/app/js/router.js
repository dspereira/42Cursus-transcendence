// Pages
import PageHome from "../page-components/page-home.js";
import PageProfile from "../page-components/page-profile.js";
import PageChat from "../page-components/page-chat.js";
import PageTournaments from "../page-components/page-tournaments.js";
import PageConfigs from "../page-components/page-configs.js";
import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";
import Page404 from "../page-components/page-404.js";
import PageInitial from "../page-components/page-initial.js";
import PageLogout from "../page-components/page-logout.js";
import PageFriends from "../page-components/page-friends.js";
import PagePlay from "../page-components/page-play.js";
import PageTournamentInfo from "../page-components/page-tournament-info.js";
import PageEmailVerification from "../page-components/page-email-verification.js";
import PageEmailSent from "../page-components/page-email-sent.js";
import PageEmailResend from "../page-components/page-email-resend.js";
import Page2FA from "../page-components/page-2fa.js";

// Components
import AppHeader from "../components/app-header.js";
import LoginForm from "../components/login-form.js";
import SignupForm from "../components/signup-form.js";
import SidePanel from "../components/side-panel.js";
import AppChat from "../components/app-chat.js";
import MsgCard from "../components/msg-card.js";
import UserProfile from "../components/user-profile.js";
import GameCard from "../components/game-card.js";
import GameHistory from "../components/game-history.js";
import AppConfigs from "../components/app-configs.js";
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
import TourneyInvitesReceived from "../components/tourney-invites-received.js";
import TourneyInviteCard from "../components/tourney-invite-card.js";
import TournamentCard from "../components/tournament-card.js";
import TourneyInfo from "../components/tourney-info.js";
import TfaEmail from "../components/tfa-email.js";

// Others
import stateManager from "./StateManager.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";
import { getHtmlElm } from "../utils/getHtmlElmUtils.js";

const routes = {
	"/initial"				: getHtmlElm(PageInitial),
	"/"						: getHtmlElm(PageHome),
	"/login"				: getHtmlElm(PageLogin),
	"/signup"				: getHtmlElm(PageSignup),
	"/logout"				: getHtmlElm(PageLogout),
	"/profile"				: getHtmlElm(PageProfile),
	"/chat"					: getHtmlElm(PageChat),
	"/tournaments"			: getHtmlElm(PageTournaments),
	"/configurations"		: getHtmlElm(PageConfigs),
	"/friends"				: getHtmlElm(PageFriends),
	"/play"					: getHtmlElm(PagePlay),
}

const dynamicRoutes = {
	"/profile": key => `<${PageProfile.componentName} username="${key}"></${PageProfile.componentName}>`,
	"/tournament": key => `<${PageTournamentInfo.componentName} id="${key}"></${PageTournamentInfo.componentName}>`,
	"/email-verification": key => `<${PageEmailVerification.componentName} token="${key}"></${PageEmailVerification.componentName}>`,
}

const publicRoutes = ["/initial", "/login", "/signup", "/email-verification"];

const initialRoute = "/initial";

const PUBLIC_ACCESS = "public";
const PRIVATE_ACCESS = "private";


// remover o page ready state

/*
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
	newElm.innerHTML = page;
}
	*/


export const render = function(page) {
	const app = document.querySelector("#app");
	const oldElm = app.querySelector("#app > div");
	const newElm = document.createElement("div");
	if (!oldElm)
		app.appendChild(newElm);
	else
		app.replaceChild(newElm, oldElm);
	newElm.innerHTML = page;
}

const getDynamicRoute = function(route) {
	const lastSlashIdx = route.lastIndexOf("/");
	let key = null;
	let newRoute = null;
	if (lastSlashIdx > 0 && lastSlashIdx < route.length - 1) {
		key = route.substring(lastSlashIdx + 1);
		newRoute = route.substring(0, lastSlashIdx);
	}
	if (!key || !newRoute)
		return null;
	return {
		"key": key,
		"route": newRoute
	}
} 

const updateIsLoggedInState = function(state) {
	if (state === undefined || state === null)
		return ;
	if (state != stateManager.getState("isLoggedIn")) {
		stateManager.setState("isLoggedIn", state);
	}
}

const getRouteInfo = function(route, isLoggedIn) {	
	let isNotFound = false;
	let accessLevel = null;
	let dynamicRouteData;
	let basePath;

	let htmlPage = routes[route];
	if (!htmlPage)
		dynamicRouteData = getDynamicRoute(route);
	if (dynamicRouteData) {
		if (dynamicRoutes[dynamicRouteData.route])
			htmlPage = dynamicRoutes[dynamicRouteData.route](dynamicRouteData.key);
	}
	if (!htmlPage) {
		dynamicRouteData = null;
		isNotFound = true;
		htmlPage = getHtmlElm(Page404);
	}
	basePath = dynamicRouteData ? dynamicRouteData.route : route;
	if (!isNotFound)
		accessLevel = publicRoutes.includes(basePath) ? PUBLIC_ACCESS : PRIVATE_ACCESS;

	if (isLoggedIn == false && route == basePath && route == "/") {
		accessLevel = PUBLIC_ACCESS;
		htmlPage = getHtmlElm(PageInitial);
	}

	return {
		rawPath: route,
		basePath: basePath,
		htmlPage: htmlPage,
		isNotFound: isNotFound,
		accessLevel: accessLevel
	}
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
let isRouting;
export const router = function(route, isHistoryNavigation) {
	isRouting = true;
	stateManager.cleanEvents();
	checkUserLoginState((isLoggedIn) => {
		let htmlPage;
		let authorizedRoute;

		if (!route)
			route = getCurrentRoute();
		route = normalizeRoute(route);
		
		const routeObj = getRouteInfo(route, isLoggedIn);
		if (!routeObj)
			console.log("Error: Getting the route");

		if ((isLoggedIn && routeObj.accessLevel == PRIVATE_ACCESS) 
			|| (!isLoggedIn && routeObj.accessLevel == PUBLIC_ACCESS)) {
			htmlPage = routeObj.htmlPage;
			authorizedRoute = routeObj.rawPath;
		}
		else if (!routeObj.isNotFound) {
			if (isLoggedIn) {
				authorizedRoute = "/";
				htmlPage = getHtmlElm(PageHome);
			}
			else {
				authorizedRoute = "/initial";
				htmlPage = getHtmlElm(PageInitial);
			}
		}
		else if (routeObj.isNotFound)
			htmlPage = routeObj.htmlPage;

		if (init || isHistoryNavigation)
			replaceCurrentRoute(normalizeRouteForHistory(authorizedRoute));
		else
			pushNewRoute(normalizeRouteForHistory(authorizedRoute));

		render(htmlPage);
		updateIsLoggedInState(isLoggedIn);
		init = false;
		isRouting = false;
	});
}

const routingHistory = function() {
	stateManager.cleanEvents();
	router(null, true);
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

stateManager.addEvent("isLoggedIn", (isLoggedIn) => {
	if (!isLoggedIn && !isRouting) {
		const routeObj = getRouteInfo(getCurrentRoute());
		if (routeObj.accessLevel == PRIVATE_ACCESS)
			redirect(initialRoute);
	}
});
