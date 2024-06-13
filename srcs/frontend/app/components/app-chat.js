import chatWebSocket from "../js/ChatWebSocket.js";

const styles = `
.red {
	border: 1px red solid;
}

.chat {
	display: flex;
}

.friend-list {
	margin-right: 25px;
}

/* Friend List */

.user {
	display: flex;
	cursor: pointer;
	align-items: center;
	gap: 10px;
	margin-bottom: 20px;
}

.user .profile-photo {
	width: 50px;
	height: auto;
	clip-path:circle();
}

.user .name {
	font-size: 16px;
	font-weight: bold;
}


/* Chat Header */

.chat-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 10px;
	padding-bottom: 10px;
	padding-right: 25px;
}

.chat-header .profile-photo {
	width: 50px;
	height: auto;
	clip-path:circle();
}

.chat-header .name {
	font-size: 16px;
	font-weight: bold;
	margin-left: 10px;
}

.block-mark {
	font-size: 12px;
    color: white;
    background-color: red;
    padding: 2px 4px;
    border-radius: 5px;
}


.icon-play {
	font-size: 16px;
}

.icon-ban {
	font-size: 16px;
}

/* Chat panel */

.chat-panel {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: #C0C0C0;
	padding: 10px 10px 10px 10px;
	border-radius: 10px;
	height: 80vh;
	width: 100%;
}

.scroll {
	/*overflow-y: scroll;*/
	overflow-y: auto;
}

/* Input Form */

form {
	position: relative;
}

.text-area {
	padding-right: 50px;
}

.icon {
	position: absolute;
	/*margin-top: 3px;*/
	font-size: 22px;
	right: 0;
	bottom: 2px;

	margin-right: 20px;
}

.icon:hover {
	cursor: pointer;
	color: blue;
	transform: scale(1.3);
	transition: transform 0.3s ease, color 0.3s ease;
}

.icon:active {
	transform: scale(1.1);
}

`;

const getHtml = function(data) {
	const html = `



	
	<div class="chat">

		<div class="friend-list"></div>

		<div class="chat-panel red">

			<div class="chat-header">
				<div>
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>			
					<span class="name">Chat with candeia</span>
					<span class="block-mark">blocked</span>
				</div>
				<div>
					<button type="button" class="btn btn-success">
						Unblock
					</button>
					
					<!--
					<button type="button" class="btn btn-success">
						<i class="icon-play bi bi-controller"></i>
					</button>
					<button type="button" class="btn btn-danger">
						<i class="icon-ban bi bi-ban"></i>
					</button>
					-->
					
				</div>
			</div>

			<div class="msg-panel scroll">

				<msg-card 
					sender="friend" 
					message="oi" 
					profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo"
					timestamp="1716890582">
				</msg-card>


				<msg-card 
					sender="owner" 
					message="Bacon ipsum dolor amet spare ribs swine chicken ribeye bresaola porchetta leberkas strip steak shoulder landjaeger ground round alcatra turducken. Ribeye pig pastrami turkey ham chicken shankle venison jowl. Sausage bacon tongue turducken, jerky prosciutto hamburger alcatra. Short loin alcatra biltong corned beef capicola picanha. Filet mignon rump bresaola frankfurter meatball."
					profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo"
					timestamp="1716890582">
				</msg-card>

				<msg-card 
					sender="owner" 
					message="Bacon ipsum dolor amet spare ribs swine chicken ribeye bresaola porchetta leberkas strip steak shoulder landjaeger ground round alcatra turducken. Ribeye pig pastrami turkey ham chicken shankle venison jowl. Sausage bacon tongue turducken, jerky prosciutto hamburger alcatra. Short loin alcatra biltong corned beef capicola picanha. Filet mignon rump bresaola frankfurter meatball."
					profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo"
					timestamp="1716890582">
				</msg-card>	

				<msg-card 
					sender="owner" 
					message="Bacon ipsum dolor amet spare ribs swine chicken ribeye bresaola porchetta leberkas strip steak shoulder landjaeger ground round alcatra turducken. Ribeye pig pastrami turkey ham chicken shankle venison jowl. Sausage bacon tongue turducken, jerky prosciutto hamburger alcatra. Short loin alcatra biltong corned beef capicola picanha. Filet mignon rump bresaola frankfurter meatball."
					profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo"
					timestamp="1716890582">
				</msg-card>

				<msg-card
					sender="owner" 
					message="Bacon ipsum dolor amet spare ribs swine chicken ribeye bresaola porchetta leberkas strip steak shoulder landjaeger ground round alcatra turducken. Ribeye pig pastrami turkey ham chicken shankle venison jowl. Sausage bacon tongue turducken, jerky prosciutto hamburger alcatra. Short loin alcatra biltong corned beef capicola picanha. Filet mignon rump bresaola frankfurter meatball."
					profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo"
					timestamp="1716890582">
				</msg-card>	

			</div>

			<div class="msg-input">
				<form id="msg-submit">
					<textarea class="form-control text-area" id="text-area" rows="1" maxlength="1000" placeholder="Type your message here.."></textarea>
					<i class="icon bi bi-send" id="send-icon"></i>
				</form>
			</div>

		</div>

	</div>

	`;
	return html;
}

export default class AppChat extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()

	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
		//this.#socket();
    }

	attributeChangedCallback(name, oldValue, newValue) {

	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
		this.msgInputscrollHeight = 0;
		this.msgInputscrollHeight1 = 0;
		this.msgInputMaxRows = 4;
	}

	#styles() {
			if (styles)
				return `@scope (.${this.elmtId}) {${styles}}`;
			return null;
	}

	#html(data){
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#scripts() {
		const friendList = getFriendsFakeCall();
		this.#createFriendListHtml(friendList);
		this.#resizeMessageInput();
		this.#setSubmitEvents();
		this.#sendMessage();
	}

	#socket() {

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
			this.#clearInputMessage(input);
		});
	}

	#createFriendListHtml(friendList) {
		const friendListHtml = this.html.querySelector(".friend-list");
		friendList.forEach((friendObj) => {
			friendListHtml.appendChild(this.#getFriendHtml(friendObj));
		})
	}

	#getFriendHtml(friendObj) {
		const elm = document.createElement("div");
		elm.classList.add("user");
		if (friendObj) {
			elm.innerHTML = `
			<img src="${friendObj.image}" class="profile-photo" alt="profile photo chat"/>
			<span class="name">${friendObj.username}</span>`;
		}
		return elm;
	}

	// this.initialScrollHeight -> Pre-calculated initial scrollHeight
	// this.scrollHeightPerLine -> Pre-calculated scrollHeight for each line after the initial line
	// scrollHeight -> Actual height of the textarea

	// Since the 'rows' attribute affects the scrollHeight of the element, I need to set the attribute 
	// to 1 to get the scrollHeight and reset to the original value
	#resizeMessageInput() {
		const input = this.html.querySelector(".text-area");

		input.addEventListener('click', () => {
			if (!this.msgInputscrollHeight) {
				input.setAttribute("rows", "1");
				this.msgInputscrollHeight = input.scrollHeight;
			}
			if (!this.msgInputscrollHeight1) {
				input.setAttribute("rows", "2");
				this.msgInputscrollHeight1 = input.scrollHeight - this.msgInputscrollHeight;
				input.setAttribute("rows", "1");
			}
		});

		input.addEventListener("input", () => {
			const actualRowsValue = input.getAttribute("rows");
			input.setAttribute("rows", "1");
			const  scrollHeight = input.scrollHeight;
			input.setAttribute("rows", actualRowsValue);
			let rows = ((scrollHeight - this.msgInputscrollHeight) / this.msgInputscrollHeight1) + 1;
			if (actualRowsValue != rows) {
				if (rows > this.msgInputMaxRows)
					rows = this.msgInputMaxRows;
				input.setAttribute("rows", String(rows));
			}
		});
	}

	#setSubmitEvents() {
		const icon = this.html.querySelector("#send-icon");
		const textArea = this.html.querySelector("#text-area");

		icon.addEventListener("click", (event) => {
			event.preventDefault();
			this.html.querySelector("#msg-submit").requestSubmit();
		});

		textArea.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				this.html.querySelector("#msg-submit").requestSubmit();
			}
		});
	}

	#getMessageToSend(elm) {
		let msg = "";

		if (!elm)
			elm = this.html.querySelector("#text-area");
		if (elm)
			msg = elm.value.trim();
		return (msg);
	}

	#clearInputMessage(elm) {
		if (!elm)
			elm = this.html.querySelector("#text-area");
		if (elm) {
			elm.value = "";
			elm.setAttribute("rows", "1");
		}
	}

	#sendMessage() {
		const submitForm = this.html.querySelector("#msg-submit");
		submitForm.addEventListener("submit", (event) => {
			event.preventDefault();
			let input = this.html.querySelector("#text-area");
			const msg = this.#getMessageToSend(input);
			this.#clearInputMessage(input);
			if (!msg)
				return ;
			chatWebSocket.send(msg);
			console.log(`msg to send: ${msg}`);
		});
	}
}

customElements.define("app-chat", AppChat);


// just for debug
const getFriendsFakeCall = function ()
{
	const data = `[
		{
			"id": 7,
			"username": "candeia1",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 8,
			"username": "user",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 2,
			"username": "candeia3",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 3,
			"username": "candeia4",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		}
	]`;

	return JSON.parse(data);
}

