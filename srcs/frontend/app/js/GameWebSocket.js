import stateManager from "./StateManager.js";

/*
Values of connection

this.socket.OPEN
this.socket.CONNECTING
this.socket.CLOSED
this.socket.CLOSING
*/

const webSockettUrl = "ws://127.0.0.1:8000/game/";

class GameWebSocket {

	constructor() {
		if (GameWebSocket.instance) {
			return GameWebSocket.instance;
		}
		GameWebSocket.instance = this;
		this.socket = null;
	}

	open(game_id) {
		if (this.isClose()) {
			this.socket = new WebSocket(webSockettUrl + game_id + "/");
			if (this.socket)
				this.#setSocketCallbacks();
		}
	}

	close() {
		if (this.isOpen()) {
			this.socket.close();
		}
	}

	send(key, status) {
		if (this.isOpen() && key && status) {
			this.socket.send(JSON.stringify({
				type: "key",
				key: key,
				status: status
			}));
		}
	}

	start() {
		if (this.isOpen()) {
			this.socket.send(JSON.stringify({
				type: "start_game"
			}));
		}
	}

	isOpen() {
		if (this.socket && this.socket.readyState == this.socket.OPEN)
			return true;
		return false;
	}

	isClose() {
		if (!this.socket || this.socket.readyState == this.socket.CLOSED)
			return true;
		return false;
	}

	#setSocketCallbacks() {
		this.socket.onopen = (event) => {
			console.log('WebSocket game open: ', event);
		};

		this.socket.onerror = (error) => {
			console.error('WebSocket game error: ', error);
			if (this.isOpen())
				this.socket.close();
		};

		this.socket.onmessage = (event) => {
			if (event.data) {
				const data = JSON.parse(event.data);
				stateManager.setState("gameStatus", data.game_state);
			}
		};

		this.socket.onclose = (event) => {
			console.log('WebSocket game close: ', event);
			this.socket = null;
		};
	}
}

const gameWebSocket = new GameWebSocket();
export default gameWebSocket;
