import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";
import { pfpStyle } from "../utils/stylingFunctions.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
.card-container {
	display: inline-block;
	background-color: ${colors.input_background};
	border-radius: 8px;
	padding: 20px 30px 20px 30px;
}

.invite-card {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: ${colors.primary_text};
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

${pfpStyle(".profile-photo", "60px", "auto")}

.exp-date {
	margin-bottom: 5px;
}

.date {
	font-size: 18px;
}

.online-status {
	position: absolute;
	display: inline-block;
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background-color: green;
	z-index: 2;
	top: 50px;
	left: 45px;
	border: 2px solid #A9A9A9;
}

.hide {
	display: none;
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

export default class TourneyInviteCard extends HTMLElement {
	static observedAttributes = ["username", "profile-photo", "invite-id", "exp", "user-id"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
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
		this.html = componentSetup(this, getHtml(this.data), styles);

		this.joinBtn = this.html.querySelector(".join-btn");
		this.declineBtn = this.html.querySelector(".decline-btn");
	}

	#scripts() {
		this.#setJoinBtnEvent();
		this.#setDeclineBtnEvent();
	}

	#setJoinBtnEvent() {
		this.joinBtn.addEventListener("click", () => {
			this.joinBtn.disabled = true;
			callAPI("PUT", `/tournament/invite/`, {id: this.data.inviteId}, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);
				this.joinBtn.disabled = false;
			}, null, getCsrfToken());
		});
	}

	#setDeclineBtnEvent() {
		this.declineBtn.addEventListener("click", () => {
			this.declineBtn.disabled = true;
			callAPI("DELETE", `/tournament/invite/?id=${this.data.inviteId}`, null, (res, data) => {
				if (res.ok)
					this.remove();
				this.declineBtn.disabled = false;
			}, null, getCsrfToken());
		});
	}

	#changeExpDate() {
		const exp = this.html.querySelector(".exp-date span");
		if (!exp)
			return ;
		exp.innerHTML = this.data.exp;
	}
}

customElements.define("tourney-invite-card", TourneyInviteCard);
