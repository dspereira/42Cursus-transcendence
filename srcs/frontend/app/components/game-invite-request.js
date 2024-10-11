import { callAPI } from "../utils/callApiUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";


const styles = `
	h3 {
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
	}

	#getInviteGamesCallApi() {
		callAPI("GET", `/game/request/`, null, (res, data) => {
			if (res.ok){
				if (data)
					this.#createRequestList(data.requests_list);
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
}

customElements.define("game-invite-request", GameInviteRequest);
