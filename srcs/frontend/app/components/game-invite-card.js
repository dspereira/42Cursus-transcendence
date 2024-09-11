import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";

const styles = `
.card-container {
	display: inline-block;
	background-color: ${colors.btn_active};
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

.exp-date {
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
				<span class="username">${charLimiter(data.username, charLimit)}</span>
			</div>
			
			<div class="exp-date">
				<span class="date">${data.exp}</span>
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
	static observedAttributes = ["username", "profile-photo", "invite-id", "exp", "user-id"];

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
		else if (name == "user-id")
			name = "userId";
		this.data[name] = newValue;

		if (name == "exp" && this.html)
			this.#changeExpDate();
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
		this.#setJoinBtnEvent();
		this.#setDeclineBtnEvent();
	}

	#setJoinBtnEvent() {
		const btn = this.html.querySelector(".join-btn");
		if(!btn)
			return ;
		btn.addEventListener("click", () => {
			callAPI("PUT", `http://127.0.0.1:8000/api/game/request/`, {id: this.data.inviteId}, (res, data) => {
				if (res.ok) {
					const contentElm = document.querySelector(".content");
					contentElm.innerHTML = `
						<app-lobby 
							lobby-id="${data.lobby_id}"
						></app-lobby>
					`;
				}
			});
		});
	}

	#setDeclineBtnEvent() {
		const btn = this.html.querySelector(".decline-btn");
		if(!btn)
			return ;
		btn.addEventListener("click", () => {
			callAPI("DELETE", `http://127.0.0.1:8000/api/game/request/`, {id: this.data.inviteId}, (res, data) => {
				if (res.ok)
					this.remove();
			});
		});
	}

	#changeExpDate() {
		const exp = this.html.querySelector(".exp-date span");
		if (!exp)
			return ;
		exp.innerHTML = this.data.exp;
	}
}

customElements.define("game-invite-card", GameInviteCard);
