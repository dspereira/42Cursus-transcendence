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

	open() {
		if (this.isClose()) {
			this.socket = new WebSocket(webSockettUrl);
			if (this.socket)
				this.#setSocketCallbacks();
		}
	}

	close() {
		if (this.isOpen()) {
			this.socket.close();
		}
	}

	send(data) {
		if (this.isOpen() && data) {
			this.socket.send(JSON.stringify({
				type: "key",
				key: data
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
				console.log(event);
				console.log(event.data);
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
