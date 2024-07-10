import stateManager from "./StateManager.js";

/*
Values of connection

this.socket.OPEN
this.socket.CONNECTING
this.socket.CLOSED
this.socket.CLOSING
*/

// Wrong link, another link is needed. This is just for test
const webSockettUrl = "ws://127.0.0.1:8000/notifications/";

class NotifyWebSocket {

	constructor() {
		if (NotifyWebSocket.instance) {
			return NotifyWebSocket.instance;
		}
		NotifyWebSocket.instance = this;
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

	send(msg) {
		if (this.isOpen() && msg) {
			this.socket.send(JSON.stringify({
				
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
			console.log('WebSocket Notify open: ', event);
		};

		this.socket.onerror = (error) => {
			console.error('WebSocket Notify error: ', error);
			if (this.isOpen())
				this.socket.close();
		};

		this.socket.onmessage = (event) => {
			if (event.data) {
				const data = JSON.parse(event.data);
				const dataType = data['type'];
			}
		};

		this.socket.onclose = (event) => {
			console.log('WebSocket Notify close: ', event);
			this.socket = null;
		};
	}
}

const notifyWebSocket = new NotifyWebSocket();
export default notifyWebSocket;
