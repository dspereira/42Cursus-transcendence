import { callAPI } from "../utils/callApiUtils.js";

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

	return `
		<button type="button" class="btn ${colorBtn} ${type}">
			<i class="bi ${icone}"></i>
		</button>`;
}

const getHtml = function(data) {
	let btns = null;
	if (data.friend == "true") {
		btns = `
		${getBtn("chat")} 
		${getBtn("play")}`;
	}
	else {
		if (data.friendRequestSent == "true")
			btns = `${getBtn("uninvite")}`;
		else
			btns = `${getBtn("invite")}`;
	}
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
	static observedAttributes = ["username", "profile-photo", "friend", "user-id", "friend-request-sent"];

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
		if (name == "friend-request-sent")
			name = "friendRequestSent";
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
		this.#btnEvents();
	}

	#friendRequest(method) {
		const body = {"requested_user": this.data.userId};
		callAPI(method, "http://127.0.0.1:8000/api/friends/request/", body, (res) => {
			if (res.ok) {
				const elm = this.html.querySelector(".buttons");
				if (elm) {
					this.#switchBtns(elm);
				}
			}
		});
	}

	#switchBtns(elm) {
		const btn = elm.querySelector("button");
		const i = elm.querySelector("i");
		btn.classList.toggle("uninvite");
		btn.classList.toggle("invite");
		btn.classList.toggle("btn-success");
		btn.classList.toggle("btn-danger");
		i.classList.toggle("bi-person-plus-fill");
		i.classList.toggle("bi-person-dash-fill");
	}

	#btnEvents() {
		let btn = this.html.querySelectorAll(".user-card button");
		btn.forEach((elm) => {
			elm.addEventListener("click", (event) => {
				if (elm.classList.contains("invite"))
					this.#friendRequest("POST");
				else if (elm.classList.contains("uninvite"))
					this.#friendRequest("DELETE");
			});
		});
	}

}

customElements.define("user-card", UserCard);
