import { colors } from "../js/globalStyles.js";
import { callAPI } from "../utils/callApiUtils.js";

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

.main-text {
	color: ${colors.second_text};
}
`;

const getHtml = function(data) {
	const html = `
		<h1 class=main-text>Tournaments Invites</h1>
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
