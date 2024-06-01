import { router, setHistoryEvents } from "./router.js"
import stateManager from "./StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import chatWebSocket from "./ChatWebSocket.js";




// Cada vez que o estado do evento altera entre true or false deve fechar ou abrir as ligações websockets
stateManager.addEvent("isLoggedIn", (stateValue) => {
	if (stateValue)
		chatWebSocket.open();
	else
		chatWebSocket.close();
});


// Deve ser inserido em um ficheiro á parte para ser chamado em cada troca de página
// Deve ser tambem adicionado um pedido à rota de refresh token
const updateUserLoginStatus = function() {
	callAPI("GET", "http://127.0.0.1:8000/api/auth/login_status", null, (res, data) => {
		if (!data || !res.ok)
			return ;
		const state = data.logged_in;
		console.log(`auth state: ${state}`);
		if (state != stateManager.getState("isLoggedIn"))
			stateManager.setState("isLoggedIn", state);
	});
}

const setupLoginStatusChecker  = function(intervalSeconds) {
	setInterval(() => {
		updateUserLoginStatus();
	}, intervalSeconds * 1000);
}

const startApp = function() {
	router();
	setHistoryEvents();
	updateUserLoginStatus();
	setupLoginStatusChecker(5);
}

document.addEventListener('DOMContentLoaded', () => {
	startApp();
});


