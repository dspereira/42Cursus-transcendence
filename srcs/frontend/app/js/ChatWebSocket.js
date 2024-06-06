import stateManager from "./StateManager.js";

// Wrong link, another link is needed. This is just for test
const webSockettUrl = "ws://127.0.0.1:8000/chat_connection/?room_id=1";

class ChatWebSocket {

	constructor() {
		if (ChatWebSocket.instance) {
			return ChatWebSocket.instance;
		}
		ChatWebSocket.instance = this;

		this.socket = null;

		/*this.chatSocket = new WebSocket(webSockettUrl);
		if (!this.chatSocket)
			console.log("Failed connection chat"); // tratar falha
		else
			console.log(this.chatSocket);*/
	}

	open() {
		if (!this.socket) {
			this.socket = new WebSocket(webSockettUrl);
			if (this.socket)
				this.#setSocketCallbacks();
		}
	}

	close() {
		if (this.socket && this.socket.OPEN) {
			this.socket.close();
		}
	}

	send(msg) {
		if (this.socket) {
			this.socket.send(JSON.stringify({
				"type": "message",
				"message": msg,
			}));
		}
	}

	connect(friendId) {
		if (this.socket) {
			this.socket.send(JSON.stringify({
				"type": "connect",
				"friend_id": friendId,
			}));
		}
	}

	isOpen() {
		if (this.socket && this.socket.OPEN)
			return true;
		return false;
	}

	#setSocketCallbacks() {
		this.socket.onopen = (event) => {
			console.log('WebSocket chat open: ', event);
		};

		this.socket.onerror = (error) => {
			console.error('WebSocket chat error: ', error);
		};

		this.socket.onmessage = (event) => {
			console.log('WebSocket chat message received: \n', event.data);
			stateManager.setState("newChatMessage", event.data);
		};

		this.socket.onclose = (event) => {
			console.log('WebSocket chat close: ', event);
			this.socket = null;
		};
	}
}

const chatWebSocket = new ChatWebSocket();
export default chatWebSocket;


/*
		let chatSocket = null;

		console.log("Init Websocket");

		const result_str = "ws://127.0.0.1:8000/chat_connection/?room_id=1";
		chatSocket = new WebSocket(result_str);

		console.log("socket");
		console.log(chatSocket);

		chatSocket.onopen = (event) => {
			console.log("Successfully connected to the WebSocket.");
		}

		chatSocket.onclose = (event) => {
			console.log("Fecha ligação");
			chatSocket = null;
		};

		chatSocket.onerror = (err) => {
			console.log("WebSocket encountered an error: " + err.message);
			console.log("Closing the socket.");
			chatSocket.close();
		}

		chatSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
		};

		// create a function that get the message from textarea and reset the value
		const submitForm = this.html.querySelector("#msg-submit");
		submitForm.addEventListener("submit", (event) => {
			event.preventDefault();
			let input = this.html.querySelector("#text-area");
			const msg = this.#getMessageToSend(input);
			if (!msg)
				return ;
			chatSocket.send(JSON.stringify({
				"message": msg,
			}));

			console.log("PASSA AQUI");

			this.#clearInputMessage(input);

			console.log(`msg: ${msg}`);
		});

*/