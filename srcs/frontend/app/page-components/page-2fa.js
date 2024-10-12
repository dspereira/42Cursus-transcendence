import {redirect} from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";
import componentSetup from "../utils/componentSetupUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `
.tfa-methods {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.main-container {
	display: flex;
	min-width: 460px;
	flex-direction: column;
	align-items: center;
}

.message {
	background: none;
	border: none;
	color: ${colors.btn_default};
	cursor: pointer;
	padding: 0;
	font: inherit;
}

.methods {
	width: 400px;
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	gap: 40px;
	margin-top: 15px;
}

.methods > :not(.hide):nth-child(2):nth-last-child(2) {
	margin: 0 auto;
}

.hide {
	display: none;
}

.logo-img {
	width: 200px;
	height: auto;
	margin: 20px 0px 20px 0px;
}

.main-text {
	color: ${colors.primary_text};
	font-size: 24px;
	fonst-weight: bold;
}

.list-group-item {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
	border-radius: 5px;
	border-style: hidden;
	max-width: 200px;
	text-align: center;
}

.list-group-item:hover {
	background-color: ${colors.btn_hover};
	color: ${colors.second_text};
}

.message {
	margin-top: 15px;
}

.alert-div {
	display: flex;
	margin: 30px auto;
	width: 80%;
	animation: disappear linear 5s forwards;
	background-color: ${colors.alert};
	z-index: 1001;
}

.alert-bar {
	width: 100%;
	height: 5px;
	border-style: hidden;
	border-radius: 2px;
	background-color: ${colors.alert_bar};
	position: absolute;
	bottom: 2px;
	animation: expire linear 5s forwards;
}

@keyframes expire {
	from {
		width: 100%;
	}
	to {
		width: 0%;
	}
}

@keyframes disappear {
	0% {
		visibility: visible;
		opacity: 1;
	}
	99% {
		visibility: visible;
		opacity: 1;
	}
	100% {
		visibility: hidden;
		opacity: 0;
		display: none;
	}
}

`;

const getHtml = function(data) {
	const html = `
	<div class=main-container>
		<img src="../img/pong-1k.png" class=logo-img>
		<div class="main-text">2FA</div>
		<div class="option-2fa"></div>
		<div class="tfa-methods">
			<button class="message">Select an alternative authentication method</button>
			<div class="list-group methods hide">
				<button type="button" class="list-group-item list-group-item-action hide" id="qr_code">Use QR Code</button>
				<button type="button" class="list-group-item list-group-item-action hide" id="email">Use Email</button>
				<button type="button" class="list-group-item list-group-item-action hide" id="phone">Use Mobile Phone</button>
			</div>
		<div>
	</div>
	`;
	return html;
}

const title = "BlitzPong - 2FA";

export default class Page2FA extends HTMLElement {
	static #componentName = "page-2fa";

	constructor() {
		super()

		document.title = title;

		this.chosenMethod;
		this.methodsObj;
		this.#initComponent();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);

		this.option2fa = this.html.querySelector(".option-2fa");
		this.msgBtn = this.html.querySelector(".message");
		this.methods = this.html.querySelector(".methods");
	}

	#scripts() {
		this.#get2faOption();
		this.#selectAnAlternativeMsgEvent();
		this.#setChooseMethodsBtnEvents();
		this.#errorMsgEvents();
	}

	#get2faOption() {
		callAPI("GET", `/two-factor-auth/configured-2fa/`, null, (res, data) => {	
			if (res.ok && data) {
				this.#setAllowedMethods(data.configured_methods);
				this.#setChosenMethod(data.method);
				this.#update2faMethod();
			}
			else if (!res.ok) {
				console.log("Error: Genting 2fa Configs.");
				redirect("/");
			}
		});
	}

	#selectAnAlternativeMsgEvent() {
		this.msgBtn.addEventListener("click", () => {
			this.methods.classList.remove("hide");
			this.msgBtn.classList.add("hide");
		});
	}

	#setChooseMethodsBtnEvents() {
		const btnList = this.html.querySelectorAll(".methods > button");
		if (!btnList)
			return ;
		btnList.forEach((elm) => {
			elm.addEventListener("click", () => {
				this.#setChosenMethod(elm.id);
				this.#update2faMethod();
			});
		});
	}

	#manageAllowedMethods() {
		if (!this.methodsObj.phone && !this.methodsObj.qr_code) {
			this.methods.classList.add("hide");
			this.msgBtn.classList.add("hide");
			return ;
		}
		let elm;
		for (let key in this.methodsObj) {
			elm = this.html.querySelector(`#${key}`);
			if (this.methodsObj[key] && key != this.chosenMethod)
				elm.classList.remove("hide");
			else
				elm.classList.add("hide");
		}
	}

	#update2faMethod() {
		this.methods.classList.add("hide");
		this.msgBtn.classList.remove("hide");
		this.#manageAllowedMethods();
		this.option2fa.innerHTML = 
		`<tfa-form 
			method=${this.chosenMethod}
			></tfa-form>`;
	}

	#setChosenMethod(method) {
		this.chosenMethod = method;
	}

	#setAllowedMethods(methods) {
		this.methodsObj = methods;
	}

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				stateManager.setState("errorMsg", null);
				const mainDiv = this.html.querySelector(".main-container");
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = mainDiv.querySelector(".main-text");
				console.log("html = ", insertElement.innerHTML);
				var alertCard = document.createElement("div");
				alertCard.className = "alert alert-danger hide from alert-div";
				alertCard.role = "alert";
				alertCard.innerHTML = `
						${msg}
						<div class=alert-bar></div>
					`;
				mainDiv.insertBefore(alertCard, insertElement);
			}
		});
	}
}

customElements.define(Page2FA.componentName, Page2FA);
