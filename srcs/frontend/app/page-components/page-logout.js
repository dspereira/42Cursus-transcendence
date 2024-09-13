import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<side-panel selected="logout"></side-panel>

	<div class="content content-small">
		<h1>logout</h1>
			<button type="button" class="btn btn-primary" id="logout-submit">Logout</button>

	</div>
	`;
	return html;
}


const title = "Logout Page";

export default class PageLogout extends HTMLElement {
	static #componentName = "page-logout";

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();

		this.data = {};
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
		this.#csrfTokeGET();
		this.#logoutEvent();
	}

	#apiResHandlerCalback(res, data) {
		if (data.ok && res.message === "success") {
			if (stateManager.getState("isLoggedIn", true))
				stateManager.setState("isLoggedIn", false);
		}
		else {
			redirect("/");
		}
	}

	#logoutEvent() {
		const logout = this.html.querySelector("#logout-submit");
		logout.addEventListener("click", (event) => {
			callAPI("POST", "http://127.0.0.1:8000/api/auth/logout", null, this.#apiResHandlerCalback, null, this.data.csrfToken);
		});
	}

	#csrfTokeGET() {
		callAPI("GET", "http://127.0.0.1:8000/api/auth/csrf_token", null, (res, data) => {
			if (res.ok)
			{
				if (document.cookie && document.cookie !== '') {
					const name = 'csrftoken';
					const cookies = document.cookie.split(';');
					for (let i = 0; i < cookies.length; i++) {
						const cookie = cookies[i].trim();
						if (cookie.substring(0, name.length + 1) === (name + '=')) {
							this.data.csrfToken = decodeURIComponent(cookie.substring(name.length + 1));
							break;
						}
					}
				}
			}
		})
	}
}

customElements.define(PageLogout.componentName, PageLogout);
