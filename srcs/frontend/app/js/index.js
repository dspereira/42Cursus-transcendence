import { router, setHistoryEvents } from "./router.js"
import stateManager from "./StateManager.js";
import chatWebSocket from "./ChatWebSocket.js";
import checkUserLoginStatus from "../utils/checkUserLoginStatus.js";

// Cada vez que o estado do evento altera entre true or false deve fechar ou abrir as ligações websockets
stateManager.addEvent("isLoggedIn", (stateValue) => {
	if (stateValue)
		chatWebSocket.open();
	else
		chatWebSocket.close();
});

const setupLoginStatusChecker  = function(intervalSeconds) {
	setInterval(() => {
		checkUserLoginStatus((status) => {
			if (status != stateManager.getState("isLoggedIn")) {
				stateManager.setState("isLoggedIn", status);
			}	
		});
	}, intervalSeconds * 1000);
}

const startApp = function() {
	setupLoginStatusChecker(5);
	router();
	setHistoryEvents();
}

document.addEventListener('DOMContentLoaded', () => {
	startApp();
});


