import stateManager from "./StateManager.js";

/*
Values of connection

this.socket.OPEN
this.socket.CONNECTING
this.socket.CLOSED
this.socket.CLOSING
*/

const webSocketUrl = "ws://127.0.0.1:8000/game/";

class GameWebSocket {

	constructor() {
		if (GameWebSocket.instance) {
			return GameWebSocket.instance;
		}
		GameWebSocket.instance = this;
		this.socket = null;
	}

	open(lobbyId) {
		if (this.isClose()) {
			if (!lobbyId)
				lobbyId = "";
			const url = `${webSocketUrl}${lobbyId}/`;
			this.socket = new WebSocket(url);
			if (this.socket)
				this.#setSocketCallbacks();
		}
	}

	close() {
		if (this.isOpen())
			this.socket.close();
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

	updateReadyStatus() {
		if (this.isOpen()) {
			this.socket.send(JSON.stringify({
				type: "update_ready_status"
			}));
		}
	}

	refreshToken() {
		if (this.isOpen()) {
			this.socket.send(JSON.stringify({
				type: "refresh_token"
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
				if (data.type == "users_info")
					stateManager.setState("lobbyStatus", data.users_info);
				else if (data.type == "game_state")
					stateManager.setState("gameStatus", data.game_state);
				else if (data.type == "time_to_start")
					stateManager.setState("gameTimeToStart", data.time);
				else if (data.type == "finished_game")
					stateManager.setState("gameWinner", data.finish_data);
				else if (data.type == "end_lobby_session")
					stateManager.setState("hasLobbyEnded", true);
			}
		};

		this.socket.onclose = (event) => {
			console.log('WebSocket game close: ', event);
			this.socket = null;
			stateManager.setState("gameSocket", "closed");
		};
	}
}

const gameWebSocket = new GameWebSocket();
export default gameWebSocket;
