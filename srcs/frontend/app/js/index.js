import { router, setHistoryEvents } from "./router.js"
import stateManager from "./StateManager.js";
import chatWebSocket from "./ChatWebSocket.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";

stateManager.addEvent("isLoggedIn", (stateValue) => {
	if (stateValue) {
		stateManager.setState("idBrowser", Math.floor(Math.random() * 100000000));
		chatWebSocket.open();
	}
	else {
		chatWebSocket.close();
		stateManager.cleanAllStatesAndEvents();
	}
});

// Event triggered when the refresh token expires and closes the chat. 
// The chat should reopen, reconnect, and send the last message.
stateManager.addEvent("chatSocket", (stateValue) => {
	console.log(`Chat socket: ${stateValue}`);
	if (stateValue == "closed") {
		checkUserLoginState((state) => {
			if (state)
				chatWebSocket.open();
		});
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


// Verify if the user is logged in, but if the refresh token has expired, refresh the access token.
// The user's logged-in state should not change because of the expired refresh token.
const setupLoginStateChecker  = function(intervalSeconds) {
	setInterval(() => {
		checkUserLoginState((state) => {
			if (state != stateManager.getState("isLoggedIn"))
				stateManager.setState("isLoggedIn", state);
		});
	}, intervalSeconds * 1000);
}

const startApp = function() {
	setupLoginStateChecker(5);
	router();
	setHistoryEvents();
}

document.addEventListener('DOMContentLoaded', () => {
	startApp();
});