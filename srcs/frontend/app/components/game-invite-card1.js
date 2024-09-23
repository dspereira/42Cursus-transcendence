import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";
import stateManager from "../js/StateManager.js";
import { pfpStyle } from "../utils/stylingFunctions.js";

// --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";


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
	position: relative;
	display: inline-block;
	margin-bottom: 5px;
}


.selected {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

${pfpStyle(".profile-photo", "60px", "auto")};

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
	let onlineVisibility = "";
	if (data.online == "false")
		onlineVisibility = "hide";

	let selected = "";
	if (data.selected == "true")
		selected = "selected";
	const html = `
	<div class="card-container ${selected}">
		<div class="invite-card">
			<div class="profile-photo-section">
				<img src="${data.profilePhoto}" class="profile-photo" alt="profile photo chat"/>
				<div class="online-status ${onlineVisibility}"></div>
			</div>
			<div class="username-section">
				<span class="username">${charLimiter(data.username, charLimit)}</span>
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
		this.#changeOnlineStatus();
		console.log("data =", this.data);
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

	#changeOnlineStatus() {
		stateManager.addEvent("onlineStatus", (value) => {
			const onlineElm = this.html.querySelector(".online-status");
			if (!onlineElm)
				return ;
			if (value.id == this.data.userId) {
				if (value.online)
					onlineElm.classList.remove("hide");
				else
					onlineElm.classList.add("hide");
			}
		});
	}
}

customElements.define("game-invite-card1", GameInviteCard1);
