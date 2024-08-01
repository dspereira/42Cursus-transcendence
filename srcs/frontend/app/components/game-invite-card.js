import { callAPI } from "../utils/callApiUtils.js";

const styles = `
.card-container {
	display: inline-block;
	background-color: #EEEDEB;
	border-radius: 8px;
	padding: 20px 30px 20px 30px;
}

.invite-card {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.join-btn {
	width: 100px;
	height: 40px;
	margin-right: 3px;
}

.decline-btn {
	width: 40px;
	height: 40px;
}

.username-section {
	margin-bottom: 15px;
}

.username {
	font-size: 18px;
	font-weight: bold;
}

.profile-photo-section {
	margin-bottom: 5px;
}

.profile-photo {
	width: 60px;
}

.expires-date {
	margin-bottom: 5px;
}

.date {
	font-size: 18px;
}

`;

const getHtml = function(data) {
	const html = `
	<div class="card-container">
		<div class="invite-card">
			<div class="profile-photo-section">
				<img src="${data.profilePhoto}" class="profile-photo" alt="profile photo chat"/>
			</div>
			<div class="username-section">
				<span class="username">${data.username}</span>
			</div>
			
			<div class="expires-date">
				<span class="date"> 5 min left</span>
			</div>
			
			<div class="buttons">
				<button type="button" class="btn btn-success join-btn">Join</button>
				<button type="button" class="btn btn-danger decline-btn">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
	</div>
	`;
	return html;
}

export default class GameInviteCard extends HTMLElement {
	static observedAttributes = ["username", "profile-photo", "invite-id"];

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
		else if (name == "invite-id")
			name = "inviteId";
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
		this.#setJoiBtnEvent();
	}

	#setJoiBtnEvent() {
		const btn = this.html.querySelector(".join-btn");
		if(!btn)
			return ;
		btn.addEventListener("click", () => {
			const contentElm = document.querySelector(".content");
			contentElm.innerHTML = `<app-lobby game-request-id="${this.data.inviteId}"></app-lobby>`;
		});
	}
}

customElements.define("game-invite-card", GameInviteCard);
