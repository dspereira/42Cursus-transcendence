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

const setupLoginStateChecker  = function(intervalSeconds) {
	setInterval(() => {
		checkUserLoginState((state) => {
			console.log(`setupLoginStateChecker log state: ${state} `);
			if (state != stateManager.getState("isLoggedIn")) {
				stateManager.setState("isLoggedIn", state);
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


