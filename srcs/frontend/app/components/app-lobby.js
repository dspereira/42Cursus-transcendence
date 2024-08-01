import { callAPI } from "../utils/callApiUtils.js";
import gameWebSocket from "../js/GameWebSocket.js";

const styles = `
	.lobby {
		display: flex;
		justify-content: center;
		text-align: center;
	}

	.owner {
		width: 50%;
	}

	.guest {
		width: 50%;
	}

	.btn-section {
		text-align: center;
		margin-top: 50px;
	}

	.ready-btn {
		display: inline-block;
	}

	.profile-photo {
		width: 145px;
		height: auto;
		clip-path:circle();
	}
`;

const getHtml = function(data) {
	const html = `

		<div class="lobby">
			<div class="owner">
				<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri1" class="profile-photo" alt="avatar">
			</div>
			<div class="guest">
				<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri2" class="profile-photo" alt="avatar">
			</div>
		</div>

		<div class="btn-section">
			<button type="button" class="btn btn-primary ready-btn">ready</button>
		</div>

	`;
	return html;
}

export default class AppLobby extends HTMLElement {
	static observedAttributes = ["lobby-id"];

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
		if (name == "lobby-id")
			name = "lobbyId";
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
		this.#openSocket();
	}

	#openSocket() {
		if (!this.data.lobbyId)
			this.data.lobbyId = "0";
		gameWebSocket.open(this.data.lobbyId);
	}
}

customElements.define("app-lobby", AppLobby);
