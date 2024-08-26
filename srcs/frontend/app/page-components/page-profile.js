import { redirect } from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";

const styles = `
	.profile-container {
		display: flex;
		justify-content: flex-start;
	}

	.profile {
		width: 30%;
	}

	.history {
		width: 70%;
	}
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="profile"></side-panel>
		<div class="content content-small">
			<div class="profile-container">
				<div class="profile">
					<user-profile></user-profile>
				</div>
				<div class="history">
					<game-history></game-history>
				</div>
			</div>
		</div>
	`;
	return html;
}


const title = "Profile";

export default class PageProfile extends HTMLElement {
	static #componentName = "page-profile";

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
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
		stateManager.setState("pageReady", true);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageProfile.componentName, PageProfile);
