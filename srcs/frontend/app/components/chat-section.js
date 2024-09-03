import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { enChatSectionDict } from "../lang-dicts/enLangDict.js";
import { ptChatSectionDict } from "../lang-dicts/ptLangDict.js";

const styles = `
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
	padding: 10px;
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
	margin-left: 10px;
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

.online-status {
	position: absolute;
	display: inline-block;
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background-color: green;
	z-index: 2;
	top: 35px;
	left: 35px;
	border: 2px solid #A9A9A9;
}

.profile-photo-status {
	position: relative;
	display: inline-block;
}

.hide {
	display: none;
}
`;

const getHtml = function(data) {
	let onlineVisibility = "";
	if (data.online == "false")
		onlineVisibility = "hide";
	console.log(data.langDict.message_placeholder)
	const html = `
		<div class="chat-section">
			<div class="chat-header">
				<div>
					<div class="profile-photo-status">
						<img src="${data.profilePhoto}" class="profile-photo" alt="profile photo chat"/>
						<div class="online-status ${onlineVisibility}"></div>
					</div>
					<span class="name">${data.username}</span>
					<span class="block-mark hide">blocked</span>
				</div>
				<div>
					<button type="button" class="btn btn-success btn-unblock hide">
						Unblock
					</button>
					<button type="button" class="btn btn-success btn-play">
						<i class="icon-play bi bi-controller"></i>
					</button>
					<button type="button" class="btn btn-danger btn-block">
						<i class="icon-ban bi bi-ban"></i>
					</button>
				</div>
			</div>
			<div class="chat-panel">
				<div class="msg-panel scroll"></div>
				<div class="msg-input">
					<form id="msg-submit">
						<textarea class="form-control text-area" id="text-area" rows="1" maxlength="2000" placeholder="${data.langDict.message_placeholder}"></textarea>
						<i class="icon bi bi-send" id="send-icon"></i>
					</form>
				</div>
			</div>
		</div>
	`;
	return html;
}

export default class ChatSection extends HTMLElement {
	static observedAttributes = ["user-id", "username", "profile-photo", "online", "language"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "profile-photo")
			name = "profilePhoto";
		if (name == "user-id")
			name = "userId";
		if (name == "language") {
			this.data.langDict = this.#getLanguage(newValue);
		}
		this.data[name] = newValue;
	}

	#getLanguage(language) {
		switch (language) {
			case "en":
				return enChatSectionDict;
			case "pt":
				return ptChatSectionDict;
			default:
		}
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
		this.msgInputscrollHeight = 0;
		this.msgInputscrollHeight1 = 0;
		this.msgInputMaxRows = 4;

		this.blockInfo = this.html.querySelector(".block-mark");
		this.btnPlay = this.html.querySelector(".btn-play");
		this.btnUnblock = this.html.querySelector(".btn-unblock");
		this.btnBlock = this.html.querySelector(".btn-block");
		this.textArea = this.html.querySelector("#text-area");
		this.sendIcon = this.html.querySelector("#send-icon");
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
		this.#getUserBlockStatus();
		stateManager.setState("chatMessagesCounter", 0);
		this.#resizeMessageInput();
		this.#setSubmitEvents();
		this.#sendMessage();
		this.#newMessageEvent();
		this.#chatScrollEvent();
		this.#changeOnlineStatus();
		this.#setBtnBlockEvent();
		this.#setBtnUnblockEvent();
		this.#setBlockStatusEvent();
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
		this.sendIcon.addEventListener("click", (event) => {
			event.preventDefault();
			this.html.querySelector("#msg-submit").requestSubmit();
		});

		this.textArea.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				this.html.querySelector("#msg-submit").requestSubmit();
			}
		});
	}

	#getMessageToSend() {
		return (this.textArea.value.trim());
	}

	#clearInputMessage() {
		this.textArea.value = "";
		this.textArea.setAttribute("rows", "1");
	}

	#disableMessageInput() {
		this.textArea.disabled = true;
		this.sendIcon.classList.add("hide");
	}

	#enableMessageInput() {		
		this.textArea.disabled = false;
		this.textArea.focus();
		this.sendIcon.classList.remove("hide");
	}

	#sendMessage() {
		const submitForm = this.html.querySelector("#msg-submit");
		submitForm.addEventListener("submit", (event) => {
			event.preventDefault();	
			stateManager.setState("isChatMsgReadyToSend", true);
			const msg = this.#getMessageToSend();
			if (!msg)
				return ;
			this.#disableMessageInput();
			chatWebSocket.send(msg);
			stateManager.setState("messageSend", true);
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

	/*
		scroll.scrollHeight -> maximum height available for scrolling
		scroll.scrollTop -> distance from the top of scroll to the top of the scrollbar
		scroll.clientHeight -> size of the scroll bar
	*/
	#newMessageEvent() {
		stateManager.addEvent("newChatMessage", (msgData) => {
			if (msgData) {

				if (msgData.type == "get_message" && !msgData.message)
				{
					chatWebSocket.lastMessageReceived();
					return ;
				}

				stateManager.setState("newChatMessage", null);
				const msgPanel = this.html.querySelector(".msg-panel");
				const newMsg = document.createElement("div");
				const timeDate = this.#getTimeDate(msgData['timestamp']);

				const msgCardElm = document.createElement("msg-card");
				msgCardElm.setAttribute("sender", `${msgData.owner}`);
				msgCardElm.setAttribute("message", `${msgData.message}`);
				msgCardElm.setAttribute("profile-photo", `${msgData.user_image}`);
				msgCardElm.setAttribute("time-date", `${timeDate}`);
				newMsg.appendChild(msgCardElm);

				let scroll = this.html.querySelector(".scroll");
				let scrollBottom = Math.floor(scroll.scrollHeight) - Math.floor(scroll.scrollTop) - Math.floor(scroll.clientHeight);
				if (msgData.type == "message")
					msgPanel.appendChild(newMsg);
				else {
					let firstMsg = msgPanel.querySelector("div")
					msgPanel.insertBefore(newMsg, firstMsg);
				}

				if (scrollBottom <= 1 || (msgData.owner == "owner" && msgData.type == "message"))
					scroll.scrollTop = scroll.scrollHeight;

				if (msgData.owner == "owner" && msgData.type == "message") {
					this.#clearInputMessage();
					this.#enableMessageInput();
				}
			}
		});
	}

	#chatScrollEvent() {
		let scroll = this.html.querySelector(".scroll");
		scroll.addEventListener("scroll", (event) => {
			let scrollTop = scroll.scrollTop;
			if (!scrollTop) {
				chatWebSocket.getMessages(stateManager.getState("chatMessagesCounter"));
				scroll.scrollTop = 1;
			}
		});
	}

	#changeOnlineStatus() {
		stateManager.addEvent("onlineStatus", (value) => {
			const onlineElm = this.html.querySelector(".online-status");
			if (!onlineElm)
				return ;
			if (value.id == this.data.userId) {
				if (value.online)
					onlineElm.classList.remove("hide");
				else
					onlineElm.classList.add("hide");
			}
		});
	}

	#setBtnBlockEvent() {
		this.btnBlock.addEventListener("click", () => {
			this.#blockStatusCall("POST", this.data.userId, "block");
		});
	}

	#setBtnUnblockEvent() {
		this.btnUnblock .addEventListener("click", () => {
			this.#blockStatusCall("POST", this.data.userId, "unblock");
		});
	}

	#getUserBlockStatus() {
		this.#blockStatusCall("GET", this.data.userId, null);
	}

	#blockStatusCall(method, friendId, blockStatus) {
		let queryParam = "";
		let data = null;

		if (method == "GET" && friendId)
			queryParam = `?id=${friendId}`;
		else if (method == "POST" && friendId && blockStatus) {
			data = {
				id: friendId,
				status: blockStatus
			}
		}
		else
			return ;

		callAPI(method, `http://127.0.0.1:8000/api/friends/block/${queryParam}`, data, (res, data) => {
			if (res.ok) {
				this.#blockUserChat(data.status, data.user_has_blocked, data.friend_has_blocked);
				if (method == "POST")
					chatWebSocket.updateBlockStatus(friendId);
			}
		});
	}

	#blockUserChat(status, user_has_blocked, friend_has_blocked) {
		this.blockInfo.classList.add("hide");
		this.btnPlay.classList.add("hide");
		this.btnBlock.classList.add("hide");
		this.btnUnblock.classList.add("hide");

		if (!status) {
			this.btnPlay.classList.remove("hide");
			this.btnBlock.classList.remove("hide");
			this.#enableMessageInput();
		}
		else {
			this.blockInfo.classList.remove("hide");
			this.#disableMessageInput();
			if (user_has_blocked)
				this.btnUnblock.classList.remove("hide");
			else if (friend_has_blocked)
				this.btnBlock.classList.remove("hide");
		}
	}

	#setBlockStatusEvent() {
		stateManager.addEvent("blockStatus", (stateValue) => {
			if (stateValue == this.data.userId)
				this.#getUserBlockStatus();
		});
	}
}

customElements.define("chat-section", ChatSection);
