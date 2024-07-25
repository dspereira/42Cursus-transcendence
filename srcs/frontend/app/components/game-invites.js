import { callAPI } from "../utils/callApiUtils.js";

const styles = `

	.create-game {
		text-align: center;
	}

	.div-border {
		display: inline-block;
		text-align: center;
		border-bottom: 3px solid #EEEDEB;
		width: 60%;
		margin-bottom: 25px;
	}

	.create-game-btn {
		padding: 10px 70px 10px 70px;
		margin-bottom: 25px;
	}

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
		flex: 1 1 calc(33.33% - 30px);
	}
`;

const getHtml = function(data) {

	const html = `
		<div class="create-game">
			<button type="button" class="btn btn-primary create-game-btn">Create Game</button>
			<div></div>
			<div class="div-border"></div>
		</div>

		<h3>Game Invites</h3>
		<div class="requests-list"></div>
	`;
	return html;
}

export default class GameInvites extends HTMLElement {
	static observedAttributes = [];

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
		this.reqList = this.html.querySelector(".requests-list");
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
		this.#getInviteGamesCallApi();
	}

	#getInviteGamesCallApi() {
		callAPI("GET", `http://127.0.0.1:8000/api/game/request/`, null, (res, data) => {
			if (res.ok){
				if (data && data.requests_list.length)
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
		this.reqList.appendChild(requestCard);
	}

	#createRequestList(requestList) {
		requestList.forEach(elm => {
			this.#insertRequestCard(elm);
		});
	}
}

customElements.define("game-invites", GameInvites);
