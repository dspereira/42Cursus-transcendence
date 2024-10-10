import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";

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
				<span class="username">${data.username}</span>
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
			callAPI("PUT", `http://127.0.0.1:8000/api/tournament/invite/`, {id: this.data.inviteId}, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);
				this.joinBtn.disabled = false;
			}, null, getCsrfToken());
		});
	}

	#setDeclineBtnEvent() {
		this.declineBtn.addEventListener("click", () => {
			this.declineBtn.disabled = true;
			callAPI("DELETE", `http://127.0.0.1:8000/api/tournament/invite/?id=${this.data.inviteId}`, null, (res, data) => {
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
