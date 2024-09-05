import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";

const styles = `
	.bracket {
		display: flex;
		width: 100%;
	}

	.game {
		width: 33.33%;
	}
	
	.profile-photo {
		width: 45px;
		height: auto;
		clip-path:circle();
		cursor: pointer;
	}

	.player {
		display: flex;
		width: 100%;
	}

	.border-container-1 {
		width: 40%;
		background-color: green;
	}

	.border-container-2 {
		width: 100%;
		background-color: blue;
	}

	.border-t {
		width: 100%;
		border-top: 2px solid red;
	}

	.border-b {
		width: 100%;
		border-bottom: 2px solid red;
	}

	.border-r {
		width: 100%;
		border-right: 2px solid red;
	}

`;

const getHtml = function(data) {
	console.log(data);

	const html = `
	<app-header></app-header>
	<side-panel selected="tournaments"></side-panel>
	<div class="content content-small">
        <h1>${data.info.name}</h1>

		<div class="bracket">
		
			<div class="game">
				<div class="player">
					<div><img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo"/></div>
					<div class="border-container-1">
						<div>1</div>
						<div class="border-t border-r">2</div>
					</div>
					<div class="border-container-2">
						<div>1</div>
						<div class="border-b">2</div>
					</div>
				</div>
				<div class="player">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo"/>
					<div class="border-container-1">
						<div class="border-b border-r">1</div>
						<div>2</div>
					</div>
					<div class="border-container-2"></div>
				</div>
			</div>


			<div class="game">
				<div>
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo"/>
				</div>
				<div>
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo"/>
				</div>
			</div>


			<div class="game">
				<div>
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo"/>
				</div>
				<div>
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo"/>
				</div>
			</div>

		</div>

    </div>
	`;
	return html;
}

const title = "Tournament Info";

export default class PageTournamentInfo extends HTMLElement {
	static #componentName = "page-tournament-info";
	static observedAttributes = ["id"];

	constructor() {
		super()
		this.data = {};
		this.info = null;
	}

	connectedCallback() {
		if (!this.data.id) {
			render("<page-404></page-404>");
		}
		else {
			callAPI("GET", `http://127.0.0.1:8000/api/tournament/info/?id=${this.data.id}`, null, (res, data) => {
				if (res.ok && data && data.info) {
					this.data["info"] = data.info;
					this.#start();
				}
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

customElements.define(PageTournamentInfo.componentName, PageTournamentInfo);
