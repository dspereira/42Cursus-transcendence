import { router, setHistoryEvents } from "./router.js"
import stateManager from "./StateManager.js";
import chatWebSocket from "./ChatWebSocket.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";
import { getCsrfTokenFromApi } from "../utils/csrfTokenUtils.js";
import { redirect } from "./router.js";

stateManager.addEvent("isLoggedIn", (stateValue) => {
	if (stateValue) {
		stateManager.setState("idBrowser", Math.floor(Math.random() * 100000000));
		chatWebSocket.open();
		getCsrfTokenFromApi();
	}
	else {
		chatWebSocket.close();
		stateManager.cleanAllStatesAndEvents();
	}
});

// Event triggered when the refresh token expires and closes the chat. 
// The chat should reopen, reconnect, and send the last message.
stateManager.addEvent("chatSocket", (stateValue) => {
	//console.log(`Chat socket: ${stateValue}`);
	const isLoggedIn = stateManager.getState("isLoggedIn");
	if (stateValue == "closed") {
		if (isLoggedIn) {
			checkUserLoginState((state) => {
				if (state)
					chatWebSocket.open();
			});
		}
	}
	else if (stateValue == "open") {
		chatWebSocket.connect(stateManager.getState("friendChatId"));
		if (stateManager.getState("isChatMsgReadyToSend")) {
			let elm = document.querySelector("#text-area");
			if (elm && elm.value)
				chatWebSocket.send(elm.value);
		}
	}
});

const startApp = function() {
	router();
	setHistoryEvents();
}

window.addEventListener("storage", (event) => {
	//DEBUG
	//console.log(`localStorage: isLoggedIn: ${localStorage.getItem("isLoggedIn")}`);
	checkUserLoginState();
});

window.addEventListener('online', () => {
	stateManager.setState("isOnline", true);
});

window.addEventListener('offline', () => {
	stateManager.setState("isOnline", false);
});

document.addEventListener('DOMContentLoaded', () => {
	startApp();
});
