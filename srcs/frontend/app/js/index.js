import { router, setHistoryEvents } from "./router.js"
import stateManager from "./StateManager.js";
import chatWebSocket from "./ChatWebSocket.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";

// Cada vez que o estado do evento altera entre true or false deve fechar ou abrir as ligações websockets
stateManager.addEvent("isLoggedIn", (stateValue) => {
	if (stateValue)
		chatWebSocket.open();
	else
		chatWebSocket.close();
});

stateManager.addEvent("chatSocket", (stateValue) => {
	console.log(`Chat socket: ${stateValue}`);
	if (stateValue == "closed")
		chatWebSocket.open();
	else if (stateValue == "open")
			chatWebSocket.connect(stateManager.getState("friendChatId"));
});


const setupLoginStateChecker  = function(intervalSeconds) {
	setInterval(() => {
		checkUserLoginState((state, userId) => {
			stateManager.setState("userId", userId);
			if (state != stateManager.getState("isLoggedIn")) {
				stateManager.setState("isLoggedIn", state);
			}
			else {
				if (state) {
					if (!chatWebSocket.isOpen())
						chatWebSocket.open();
				}
			}
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
