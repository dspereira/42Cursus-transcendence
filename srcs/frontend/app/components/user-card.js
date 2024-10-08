import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `

.user-card {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border-radius: 8px;
	padding: 5px 25px;
	background-color: #A9A9A9;
}

.user {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 20px;
}

.user-photo {
	width: 50px;
}

.user-name {
	font-size: 16px;
	font-weight: bold;
}

button > i {
	font-size: 16px;
}

button {
	margin-left: 5px;
}

`;

const getBtn = function(type) {
	let icone = null;
	let colorBtn = "btn-success";

	console.log

	if (type == "play")
		icone = `bi-controller`;
	else if (type == "chat")
		icone = `bi-chat`;
	else if (type == "invite")
		icone = `bi-person-plus-fill`;
	else if (type == "uninvite") {
		icone = `bi-person-dash-fill`;
		colorBtn = "btn-danger";
	}
	else if (type == "requestAccept")
		icone = "bi-check2";
	else if (type == "requestDecline") {
		icone = "bi-x-lg";
		colorBtn = "btn-danger";
	}
	else if (type == "removeFriend") {
		icone = "bi-person-dash";
		colorBtn = "btn-danger";
	}

	return `
		<button type="button" class="btn ${colorBtn} ${type}">
			<i class="bi ${icone}"></i>
		</button>`;
}

const getHtml = function(data) {
	let btns = "";
	if (data.friendRequestSentBtn == "true")
		btns = getBtn("invite");
	if (data.friendRequestRemoveBtn == "true")
		btns += getBtn("uninvite");
	if (data.friendRequestAcceptBtn == "true")
		btns += getBtn("requestAccept");
	if (data.friendRequestDeclineBtn == "true")
		btns += getBtn("requestDecline");
	if (data.chatBtn == "true")
		btns += getBtn("chat");
	if (data.playBtn == "true")
		btns += getBtn("play");
	if (data.removeFriendBtn == "true")
		btns += getBtn("removeFriend");	

	const html = `
		<div class="user-card">
			<div class="user">
				<img src="${data.profilePhoto}" class="user-photo" alt="profile photo chat"/>
				<span class="user-name">${data.username}</span>
			</div>
			<div class="buttons">
				${btns}
			</div>
		</div>
	`;
	return html;
}

export default class UserCard extends HTMLElement {
	static observedAttributes = [
		"username", 
		"profile-photo", 
		"friend", 
		"user-id", 
		"request-id",
		"friend-request-sent-btn",
		"friend-request-remove-btn",
		"friend-request-accept-btn",
		"friend-request-decline-btn",
		"chat-btn",
		"play-btn",
		"remove-friend-btn",
		"csrf-token"
	];

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
		else if (name == "user-id")
			name = "userId";
		else if (name == "request-id")
			name = "requestId";
		else if (name == "friend-request-sent")
			name = "friendRequestSent";
		else if (name == "friend-request-sent-btn")
			name = "friendRequestSentBtn";
		else if (name == "friend-request-remove-btn")
			name = "friendRequestRemoveBtn";
		else if (name == "friend-request-accept-btn")
			name = "friendRequestAcceptBtn";
		else if (name == "friend-request-decline-btn")
			name = "friendRequestDeclineBtn";
		else if (name == "chat-btn")
			name = "chatBtn";
		else if (name == "play-btn")
			name = "playBtn";
		else if (name == "remove-friend-btn")
			name = "removeFriendBtn";
		else if (name == "csrf-token")
			name = "csrfToken";
		this.data[name] = newValue;
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
		this.#setInviteAndDeclineEvent();
		this.#setDeclineEvent();
		this.#setAcceptEvent();
		this.#setRemoveEvent();
	}

	#friendRequest(method, body, callback) {
		callAPI(method, "http://127.0.0.1:8000/api/friends/request/", body, (res, data) => {
			if (res.ok)
				callback(data);
		}, null, stateManager.getState("csrfToken"));
	}

	#friends(method, body, callback) {
		callAPI(method, "http://127.0.0.1:8000/api/friends/friendships/", body, (res, data) => {
			if (res.ok)
				callback(data);
		}, null, stateManager.getState("csrfToken"));
	}

	#switchBtns(btn) {
		const icon = btn.querySelector("i");
		btn.classList.toggle("uninvite");
		btn.classList.toggle("invite");
		btn.classList.toggle("btn-success");
		btn.classList.toggle("btn-danger");
		icon.classList.toggle("bi-person-plus-fill");
		icon.classList.toggle("bi-person-dash-fill");
	}
	#setInviteAndDeclineEvent() {
		let btn = this.html.querySelector(".user-card .invite");
		if (!btn)
			btn = this.html.querySelector(".user-card .uninvite");
		if(!btn)
			return ;
		btn.addEventListener("click", () => {
			if (btn.classList.contains("invite")) {
				this.#friendRequest("POST", {"requested_user": this.data.userId}, (data) => {
					this.data.requestId = data.request_id;
					this.#switchBtns(btn);
				});
			}
			else {
				this.#friendRequest("DELETE", {"request_id": this.data.requestId}, () => {
					this.#switchBtns(btn);
				});
			}
		});
	}

	#setDeclineEvent() {
		let btn = this.html.querySelector(".user-card .requestDecline");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			this.#friendRequest("DELETE", {"request_id": this.data.requestId}, () => {
				this.remove();
			});
		});
	}

	#setAcceptEvent() {
		let btn = this.html.querySelector(".user-card .requestAccept");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			this.#friends("POST", {"request_id": this.data.requestId}, () => {
				this.remove();
			});
		});
	}

	#setRemoveEvent() {
		let btn = this.html.querySelector(".user-card .removeFriend");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			this.#friends("DELETE", {"friend_id": this.data.userId}, () => {
				this.remove();
			});
		});
	}
}

customElements.define("user-card", UserCard);
