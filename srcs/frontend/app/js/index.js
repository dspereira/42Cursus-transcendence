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

stateManager.addEvent("chatSocket", (stateValue) => {
	console.log(`Chat socket: ${stateValue}`);
	if (stateValue == "closed") {
		checkUserLoginState((state, userId) => {
			stateManager.setState("userId", userId);
			if (state != stateManager.getState("isLoggedIn"))
				stateManager.setState("isLoggedIn", state);
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
