import { router, setHistoryEvents } from "./router.js"
import stateManager from "./StateManager.js";
import chatWebSocket from "./ChatWebSocket.js";
import notifyWebSocket from "./NotifyWebSocket.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";

// Cada vez que o estado do evento altera entre true or false deve fechar ou abrir as ligações websockets

stateManager.setState("idBrowser", Math.floor(Math.random() * 100000000000));

stateManager.addEvent("isLoggedIn", (stateValue) => {
	stateManager.cleanAllStatesAndEvents();
	if (stateValue) {
		chatWebSocket.open();
		//notifyWebSocket.open();
	}
	else {
		chatWebSocket.close();
		//notifyWebSocket.close();
	}
});

// Event triggered when the refresh token expires and closes the chat. 
// The chat should reopen, reconnect, and send the last message.
stateManager.addEvent("chatSocket", (stateValue) => {
	console.log(`Chat socket: ${stateValue}`);
	if (stateValue == "closed") {
		checkUserLoginState((state, userId) => {
			stateManager.setState("userId", userId);
			//if (state != stateManager.getState("isLoggedIn"))
			//	stateManager.setState("isLoggedIn", state);
			if (state)
				chatWebSocket.open();
		});
	}
	else if (stateValue == "open") {
		chatWebSocket.connect(stateManager.getState("friendChatId"));
		let elm = document.querySelector("#text-area");
		if (elm && elm.value)
			chatWebSocket.send(elm.value);
	}
});


// Verify if the user is logged in, but if the refresh token has expired, refresh the access token.
// The user's logged-in state should not change because of the expired refresh token.
const setupLoginStateChecker  = function(intervalSeconds) {
	setInterval(() => {
		checkUserLoginState((state, userId) => {
			stateManager.setState("userId", userId);
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
