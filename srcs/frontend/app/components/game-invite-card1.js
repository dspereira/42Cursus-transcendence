import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";

const styles = `
.card-container {
	display: inline-block;
	background-color: ${colors.input_background};
	color: ${colors.second_text};
	border-radius: 8px;
	padding: 20px 30px 20px 30px;
	cursor: pointer;
}

.invite-card {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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

.selected {
	background-color: ${colors.button_default};
	color: ${colors.primary_text};
}

`;

const getHtml = function(data) {
	let selected = "";
	if (data.selected == "true")
		selected = "selected";

	const html = `
	<div class="card-container ${selected}">
		<div class="invite-card">
			<div class="profile-photo-section">
				<img src="${data.profilePhoto}" class="profile-photo" alt="profile photo chat"/>
			</div>
			<div class="username-section">
				<span class="username">${data.username}</span>
			</div>
		</div>
	</div>
	`;
	return html;
}

export default class GameInviteCard1 extends HTMLElement {
	static observedAttributes = ["username", "profile-photo", "user-id", "online", "selected"];

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
		else if (name == "user-id")
			name = "userId";
		this.data[name] = newValue;

		if (name == "selected")
			this.#markAsSelected();
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
	}

	#markAsSelected() {
		if (!this.html)
			return ;
		const card = this.html.querySelector(".card-container");
		if (!card)
			return ;
		if (this.data.selected == "true")
			card.classList.add("selected");
		else
			card.classList.remove("selected");
	}
}

customElements.define("game-invite-card1", GameInviteCard1);
