import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";

const styles = `

.text-color {
	color: ${colors.primary_text};

}

.logout-btn {
	border-style: hidden;
	width: 100px;
	height: 50px;
	background-color: ${colors.button};
	color: ${colors.second_text};
}

.logout-btn:hover {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.popup-overlay {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(5px);
	justify-content: center; 
	align-items: center;
	z-index: 9999;
}

.popup-content {
	background: ${colors.second_card};
	padding: 20px;
	border-radius: 5px;
	text-align: center;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	width: 30%;
}

#closePopup {
	margin-top: 15px;
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
}

#closePopup:hover {
	color: ${colors.second_text};
}

`;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<side-panel selected="logout"></side-panel>
	<div class="content content-small text-color">
		<h1>Logout</h1>
		<button type="button" class="btn btn-primary logout-btn" id="logout-submit">Logout</button>
		<button id="openPopup">open-logout popup</button>
		<div id="logout-popup" class="popup-overlay">
			<div class="popup-content">
			<h2>This is a Popup!</h2>
			<p>Some content goes here...</p>
			<button id="closePopup">Close</button>
		</div>
	</div>

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
		this.#logoutEvent();
		this.#logOutPopUp();
	}

	#apiResHandlerCalback(res, data) {
		if (data.ok && res.message === "success")
			updateLoggedInStatus(false);
		else
			redirect("/");
	}

	#logoutEvent() {
		const logout = this.html.querySelector("#logout-submit");
		logout.addEventListener("click", (event) => {
			callAPI("POST", "http://127.0.0.1:8000/api/auth/logout", null, this.#apiResHandlerCalback);
		});
	}

	#logOutPopUp() {
		const popup = document.getElementById('logout-popup');
		const openPopupButton = document.getElementById('openPopup');
		const closePopupButton = document.getElementById('closePopup');

		openPopupButton.addEventListener('click', () => {
			popup.style.display = 'flex';
		});

		closePopupButton.addEventListener('click', () => {
			popup.style.display = 'none';
		});

		window.addEventListener('click', (event) => {
			if (event.target === popup) {
				popup.style.display = 'none';
			}
		});
	}
}

customElements.define(PageLogout.componentName, PageLogout);
