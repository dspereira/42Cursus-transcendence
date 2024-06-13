import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";

const styles = `
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
	padding: 10px;
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

/* Chat section */

.chat-section {
	width: 100%;
}

/* Chat panel */

.chat-panel {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	background-color: #C0C0C0;
	/*padding: 10px 10px 10px 10px;*/
	border-radius: 0px 0px 10px 10px;
	height: 80vh;
	width: 100%;
}

/* Chat Header */

.chat-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 10px;
	padding-bottom: 10px;
	padding-right: 25px;
	border-radius: 10px 10px 0px 0px;
	background-color: #A9A9A9;
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

/* msg panel */

.msg-panel {
	padding: 10px 10px 10px 10px;
}
.scroll {
	/*overflow-y: scroll;*/
	overflow-y: auto;
}

/* Input Form */

.msg-input {
	padding: 10px 10px 10px 10px;
	border-radius: 0px 0px 10px 10px;
	background-color: #A9A9A9;
}

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

.friend-selected {
	background-color: #4287f5;
	border-radius: 8px;
}

`;

const getHtml = function(data) {
	const html = `



	
	<div class="chat">

		<div class="friend-list"></div>

		<div class="chat-section">

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
					
					
					<button type="button" class="btn btn-success">
						<i class="icon-play bi bi-controller"></i>
					</button>
					<button type="button" class="btn btn-danger">
						<i class="icon-ban bi bi-ban"></i>
					</button>
					
					
				</div>
			</div>

			<div class="chat-panel">
				<div class="msg-panel scroll"></div>
				<div class="msg-input">
					<form id="msg-submit">
						<textarea class="form-control text-area" id="text-area" rows="1" maxlength="2000" placeholder="Type your message here.."></textarea>
						<i class="icon bi bi-send" id="send-icon"></i>
					</form>
				</div>
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
		this.#setFriendClickEventHandler();
		this.#setStateEvent();
		this.#newMessageEvent();
		this.#chatScrollEvent();
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
		//elm.classList.add("friend-selected");
		elm.id = `id-${friendObj.id}`;
		if (friendObj) {
			elm.innerHTML = `
			<img src="${friendObj.image}" class="profile-photo" alt="profile photo chat"/>
			<span class="name">${friendObj.username}</span>`;
		}
		return elm;
	}

	#removeAllSelectedFriends(friends) {
		friends.forEach((elm) => {
			elm.classList.remove("friend-selected");
		});
	}

	#setFriendClickEventHandler() {
		const friends = this.html.querySelectorAll(".user");

		friends.forEach((elm) => {
			elm.addEventListener("click", (event) => {
				this.#removeAllSelectedFriends(friends);
				const id = elm.id.substring(3);
				if (stateManager.getState("friendChatId") != id) {
					stateManager.setState("friendChatId", id);
				}
				elm.classList.add("friend-selected");
			});
		});
	}

	#setStateEvent() {
		stateManager.addEvent("friendChatId", (stateValue) => {
			console.log(`friendChatId: ${stateValue}`);
			if (stateValue) {
				chatWebSocket.connect(stateManager.getState("friendChatId"));
				chatWebSocket.get_messages(stateManager.getState("chatMessagesCounter"));
			}
		});
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
		});
	}

	#getTimeDate(timestamp) {

		const msgDate = new Date(timestamp * 1000);
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today);
		let hours = msgDate.getHours();
		const minutes = msgDate.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';

		yesterday.setDate(today.getDate() - 1);
		hours = hours % 12;
		hours = hours ? hours : 12;

		const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
		const time = `${hours}:${minutesFormatted}${ampm}`
		let dateStr = null;

		if (msgDate >= today)
			dateStr = `Today`;
		else if (msgDate >= yesterday)
			dateStr = `Yesterday`;
		else
		{
			const year = msgDate.getFullYear();
			const month = msgDate.getMonth() < 10 ? '0' + msgDate.getMonth() : msgDate.getMonth();
			const day = msgDate.getDate() < 10 ? '0' + msgDate.getDate() : msgDate.getDate();
			dateStr = `${year}-${month}-${day}`;
		}

		return `${dateStr} ${time}`;
	}

	#newMessageEvent() {

		stateManager.addEvent("newChatMessage", (msgData) => {
			if (msgData) {
				// console.log("New message received.\n", msgData);
				stateManager.setState("newChatMessage", null);

				const msgPanel = this.html.querySelector(".msg-panel");
				const newMsg = document.createElement("div");
				const timeDate = this.#getTimeDate(msgData['timestamp']);
				newMsg.innerHTML = `
					<msg-card 
						sender="${msgData.owner}" 
						message="${msgData.message}"
						profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo"
						time-date="${timeDate}">
					</msg-card>
				`
				let scroll = this.html.querySelector(".scroll");
				let scrollBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight;

				if (msgData.type == "message")
					msgPanel.appendChild(newMsg);
				else {
					let firstMsg = msgPanel.querySelector("div")
					msgPanel.insertBefore(newMsg, firstMsg);
				}

				if (scrollBottom == 0)
					scroll.scrollTop = scroll.scrollHeight;
			}
		});
	}

	#chatScrollEvent() {
		let scroll = this.html.querySelector(".scroll");
		scroll.addEventListener("scroll", (event) => {
			let scrollTop = scroll.scrollTop;
			if (!scrollTop) {
				chatWebSocket.get_messages(stateManager.getState("chatMessagesCounter"));
				scroll.scrollTop = 1;
			}
		});
	}
}

customElements.define("app-chat", AppChat);

// just for debug
const getFriendsFakeCall = function ()
{
	const data = `[
		{
			"id": 2,
			"username": "admin",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 1,
			"username": "diogo",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 3,
			"username": "irineu",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 4,
			"username": "irineu2",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		}
	]`;

	return JSON.parse(data);
}
