import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";

const styles = `
.tfa-methods {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.main-container {
	display: flex;
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
	width: 100%;
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
	color: ${colors.second_text};
	border-radius: 5px;
	border-style: hidden;
}

.list-group-item:hover {
	background-color: ${colors.btn_hover};
	color: ${colors.primary_text};
}

`;

const getHtml = function(data) {
	const html = `
	<div class=main-container>
		<img src="../img/Pong.png" class=logo-img>
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

const title = "2FA page";

export default class Page2FA extends HTMLElement {
	static #componentName = "page-2fa";

	constructor() {
		super()
		this.chosenMethod;
		this.methodsObj;
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
		this.option2fa = this.html.querySelector(".option-2fa");
		this.msgBtn = this.html.querySelector(".message");
		this.methods = this.html.querySelector(".methods");
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
		this.#get2faOption();
		this.#selectAnAlternativeMsgEvent();
		this.#setChooseMethodsBtnEvents();
	}

	#get2faOption() {
		callAPI("GET", `http://127.0.0.1:8000/api/two-factor-auth/configured-2fa/`, null, (res, data) => {	
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
}

customElements.define(Page2FA.componentName, Page2FA);
