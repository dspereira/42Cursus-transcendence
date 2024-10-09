import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { enPagePlayDict } from "../lang-dicts/enLangDict.js";
import { ptPagePlayDict } from "../lang-dicts/ptLangDict.js";
import { esPagePlayDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
	.invite-game {
		text-align: center;
	}

	.div-border {
		display: inline-block;
		text-align: center;
		border-bottom: 3px solid #EEEDEB;
		width: 60%;
		margin-bottom: 25px;
	}

	.invite-game-btn {
		padding: 10px 70px 10px 70px;
		margin-bottom: 25px;
	}
`;

const getHtml = function(data) {
	console.log(data);
	const html = `
	<app-header></app-header>
	<side-panel selected="play" language=${data.language}></side-panel>
	<div class="content content-small">
		<div class="page-1">
			<div class="invite-game">
				<button type="button" class="btn btn-primary invite-game-btn">${data.langDict.invite_button}</button>
				<div></div>
				<div class="div-border"></div>
			</div>
			<game-invite-request language=${data.language}></game-invite-request>
		</div>
	</div>
	`;
	return html;
}

const title = "Play";

export default class PagePlay extends HTMLElement {
	static #componentName = "page-play";

	constructor() {
		super()

		this.data = {};
		this.#loadInitialData();
	}

	static get componentName() {
		return this.#componentName;
	}

	async #loadInitialData() {
		await callAPI("GET", "http://127.0.0.1:8000/api/settings/", null, (res, data) => {
			if (res.ok) {
				if (data && data.settings.language){
					this.data.language = data.settings.language;
					this.data.langDict = getLanguageDict(this.data.language, enPagePlayDict, ptPagePlayDict, esPagePlayDict);
				}
		}
		});

		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
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
		stateManager.setState("pageReady", true);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
		this.#setInviteToGameEvent();
		this.#inviteToPlayAndRedirectToLobby();
	}

	#setInviteToGameEvent() {
		const btn = this.html.querySelector(".invite-game-btn");
		const page1 = this.html.querySelector(".page-1");
		const content = this.html.querySelector(".content");
		if (!btn && !page1 && !content)
			return ;
		btn.addEventListener("click", () => {
			content.removeChild(page1);
			content.innerHTML = `<game-invite-send language=${this.data.language}></game-invite-send>`;
		});
	}

	#inviteToPlayAndRedirectToLobby() {
		const stateInfo = stateManager.getState("friendIdInvitedFromChat");
		if (!stateInfo)
			return ;

		stateManager.setState("friendIdInvitedFromChat", null);
		const data = {
			invites_list: [`${stateInfo}`]
		};

		callAPI("POST", "http://127.0.0.1:8000/api/game/request/", data, (res, data) => {
			if (res.ok) {
				const contentElm = document.querySelector(".content");
				contentElm.innerHTML = `
				<app-lobby 
					lobby-id="${stateManager.getState("userId")}"
					language="${this.data.language}"
				></app-lobby>
				`;
			}
		}, null, stateManager.getState("csrfToken"));
	}
}

customElements.define(PagePlay.componentName, PagePlay);
