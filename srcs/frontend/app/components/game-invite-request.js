import { callAPI } from "../utils/callApiUtils.js";
import getCsrfToken from "../utils/getCsrfToken.js";

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
		this.#render();
		this.#scripts();
	}

	disconnectedCallback() {
		if (this.intervalID)
			clearInterval(this.intervalID);
	}

	attributeChangedCallback(name, oldValue, newValue) {

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
		this.reqListHtml = this.html.querySelector(".requests-list");
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
		getCsrfToken(this.data);
		this.#getInviteGamesCallApi();
		this.#startGameInvitesPolling();
	}

	#getInviteGamesCallApi() {
		callAPI("GET", `http://127.0.0.1:8000/api/game/request/`, null, (res, data) => {
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
		requestCard.setAttribute("csrf-token", this.data.csrfToken);
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
			this.#getInviteGamesCallApi();
		}, 5000);
	}
}

customElements.define("game-invite-request", GameInviteRequest);
