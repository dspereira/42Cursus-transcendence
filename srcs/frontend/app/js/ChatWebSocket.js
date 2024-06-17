import stateManager from "./StateManager.js";

/*
Values of connection

this.socket.OPEN
this.socket.CONNECTING
this.socket.CLOSED
this.socket.CLOSING
*/

// Wrong link, another link is needed. This is just for test
const webSockettUrl = "ws://127.0.0.1:8000/chat_connection/";

class ChatWebSocket {

	constructor() {
		if (ChatWebSocket.instance) {
			return ChatWebSocket.instance;
		}
		ChatWebSocket.instance = this;
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
				"type": "message",
				"message": msg,
			}));
		}
	}

	connect(friendId) {
		if (this.isOpen() && friendId) {
			this.socket.send(JSON.stringify({
				"type": "connect",
				"friend_id": friendId,
			}));
		}
	}

	get_messages(messagesCount) {
		if (this.isOpen() && messagesCount >= 0) {
			this.socket.send(JSON.stringify({
				"type": "get_messages",
				"message_count": messagesCount,
				"idBrowser": stateManager.getState("idBrowser")
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

	#updateMessageCounterState(actual_state) {
		stateManager.setState("chatMessagesCounter", actual_state + 1);
	}

	#setSocketCallbacks() {
		this.socket.onopen = (event) => {
			console.log('WebSocket chat open: ', event);
			stateManager.setState("chatSocket", "open");
		};

		this.socket.onerror = (error) => {
			console.error('WebSocket chat error: ', error);
			if (this.isOpen())
				this.socket.close();
		};

		this.socket.onmessage = (event) => {
			if (event.data) {
				const data = JSON.parse(event.data);
				const dataType = data['type'];

				if (dataType == "message") {
					this.#updateMessageCounterState(stateManager.getState("chatMessagesCounter"));
					stateManager.setState("newChatMessage", data);
				}
				else if (dataType == "get_message" && data['requester_id'] == stateManager.getState("userId")) {
					if (data['idBrowser'] == stateManager.getState("idBrowser")) {
						this.#updateMessageCounterState(stateManager.getState("chatMessagesCounter"));
						stateManager.setState("newChatMessage", data);
					}
				}
			}
		};

		this.socket.onclose = (event) => {
			console.log('WebSocket chat close: ', event);
			this.socket = null;
			stateManager.setState("chatSocket", "closed");
		};
	}
}

const chatWebSocket = new ChatWebSocket();
export default chatWebSocket;
