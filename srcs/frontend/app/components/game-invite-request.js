import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";
import stateManager from "../js/StateManager.js";
import componentSetup from "../utils/componentSetupUtils.js";


const styles = `
	h3 {
		color: ${colors.second_text};
		margin-bottom: 20px;
		font-size: 22px;
		text-align: center;
	}

	.requests-list {
		display: flex;
		flex-wrap: wrap;
		gap: 30px;
		justify-content: center;
	}

	.alert-div {
		display: flex;
		margin: 30px auto;
		width: 100%;
		animation: disappear linear 5s forwards;
		background-color: ${colors.alert};
		z-index: 1001;
	}

	.alert-bar {
		width: 95%;
		height: 5px;
		border-style: hidden;
		border-radius: 2px;
		background-color: ${colors.alert_bar};
		position: absolute;
		bottom: 2px;
		animation: expire linear 5s forwards;
	}

	@keyframes expire {
		from {
			width: 95%;
		}
		to {
			width: 0%;
		}
	}

	@keyframes disappear {
		0% {
			visibility: visible;
			opacity: 1;
		}
		99% {
			visibility: visible;
			opacity: 1;
		}
		100% {
			visibility: hidden;
			opacity: 0;
			display: none;
		}
	}
`;

const getHtml = function(data) {

	const html = `
		<h3>Game Invites</h3>
		<div class="requests-list"></div>
	`;
	return html;
}

export default class GameInviteRequest extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.data = {};
		this.intervalID = null;
		this.lastRequestSize = 0;;
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	disconnectedCallback() {
		if (this.intervalID)
			clearInterval(this.intervalID);
	}

	attributeChangedCallback(name, oldValue, newValue) {

	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
		this.reqListHtml = this.html.querySelector(".requests-list");
	}

	#scripts() {
		this.#getInviteGamesCallApi();
		this.#startGameInvitesPolling();
		this.#errorMsgEvents();
	}

	#getInviteGamesCallApi() {
		callAPI("GET", `/game/request/`, null, (res, data) => {
			if (res.ok){
				if (data)
				{
					this.#createRequestList(data.requests_list);
					if (data.requests_list.length < this.lastRequestSize)
						stateManager.setState("errorMsg", "An invite has expired");
					this.lastRequestSize = data.requests_list.length;
				}
			}
		});
	}

	#insertRequestCard(requestData) {
		const requestCard = document.createElement("game-invite-card");
		requestCard.setAttribute("invite-id", requestData.req_id);
		requestCard.setAttribute("user-id", requestData.id);
		requestCard.setAttribute("username", requestData.username);
		requestCard.setAttribute("profile-photo", requestData.image);
		requestCard.setAttribute("exp", requestData.exp);
		requestCard.setAttribute("user-id", requestData.id);
		this.reqListHtml.appendChild(requestCard);
	}

	#createRequestList(requestList) {
		this.reqListHtml.innerHTML = "";
		requestList.forEach(elm => {
			this.#insertRequestCard(elm);
		});
	}

	#startGameInvitesPolling() {
		this.intervalID = setInterval(() => {
			if (!stateManager.getState("isOnline"))
				return ;
			this.#getInviteGamesCallApi();
		}, 5000);
	}

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				stateManager.setState("errorMsg", null);
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = this.html.querySelector(".send-invite-section");
				var alertCard = document.createElement("div");
				alertCard.className = "alert alert-danger hide from alert-div";
				alertCard.role = "alert";
				alertCard.innerHTML = `
						${msg}
						<div class=alert-bar></div>
					`;
				this.html.insertBefore(alertCard, insertElement);
			}
		});
	}
}

customElements.define("game-invite-request", GameInviteRequest);
