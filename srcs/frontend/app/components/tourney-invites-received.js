import { callAPI } from "../utils/callApiUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `	
h1 {
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
		<h1>Tournaments Invites</h1>
		<div class="requests-list"></div>
	`;
	return html;
}

export default class TourneyInvitesReceived extends HTMLElement {
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
		this.#getInviteTournamentsCallApi();
		this.#startGameInvitesPolling();
	}

	#insertRequestCard(requestData) {
		const requestCard = document.createElement("tourney-invite-card");
		requestCard.setAttribute("invite-id", requestData.req_id);
		requestCard.setAttribute("user-id", requestData.id);
		requestCard.setAttribute("username", requestData.username);
		requestCard.setAttribute("profile-photo", requestData.image);
		requestCard.setAttribute("exp", requestData.exp);
		requestCard.setAttribute("user-id", requestData.id);
		this.reqListHtml.appendChild(requestCard);
	}

	#createRequestList(requestList) {
		if (!requestList)
			return ;
		this.reqListHtml.innerHTML = "";
		requestList.forEach(elm => {
			this.#insertRequestCard(elm);
		});
	}

	#getInviteTournamentsCallApi() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/invite/`, null, (res, data) => {
			if (res.ok) {
				if (data && data.requests_list)
					this.#createRequestList(data.requests_list);
			}
		});
	}

	#startGameInvitesPolling() {
		this.intervalID = setInterval(() => {
			this.#getInviteTournamentsCallApi();
		}, 5000);
	}
}

customElements.define("tourney-invites-received", TourneyInvitesReceived);
