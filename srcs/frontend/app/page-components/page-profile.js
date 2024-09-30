import { redirect, render } from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";

const styles = `
	.profile-container {
		min-width: 460px;
		flex-direction: row;
		color: ${colors.second_text};
		display: flex;
		justify-content: center;
		gap: 50px;
	}

	.profile {
		width: 30%;
		min-width: 280px;
	}

	.history {
		width: 70%;
		min-width: 350px;
	}

	@media (max-width: 1100px) {
		.profile-container {
			flex-direction: column;
			align-items: center;
		}
		.history {
			width: 100%;
		}
		.profile {
			width: 100%;
		}
	}
`;

const getHtml = function(data) {
	console.log(data);
	console.log("Id = ", stateManager.getState("userId"));
	const html = `
		<app-header></app-header>
		<side-panel selected="profile"></side-panel>
		<div class="content content-small">
			<div class="profile-container">
				<div class="profile">
					<user-profile username="${data.username}"></user-profile>
				</div>
				<div class="history">
					<game-history username="${data.username}"></game-history>
				</div>
			</div>
		</div>
	`;
	return html;
}

const title = "Profile";

export default class PageProfile extends HTMLElement {
	static #componentName = "page-profile";
	static observedAttributes = ["username"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		if (!this.data.username) {
			this.data.username = stateManager.getState("username");
			this.#start();
		}
		else {
			callAPI("GET", `http://127.0.0.1:8000/api/profile/exists/?username=${this.data.username}`, null, (res, data) => {
				if (res.ok && data && data.exists)
					this.#start();
				else
					render("<page-404></page-404>");
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}

	static get componentName() {
		return this.#componentName;
	}

	#start() {
		this.#initComponent();
		this.#render();
		this.#scripts();
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
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageProfile.componentName, PageProfile);
