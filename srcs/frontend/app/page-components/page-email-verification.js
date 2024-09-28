import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";
import { redirect } from "../js/router.js";

const styles = `
.mail-info-container {
	max-width: 400px;
	padding: 30px;
	border-radius: 8px;
	text-align: center;
	margin: 50px auto 0px auto;
	/*background-color: #ca9400;*/
}

img {
	width: 80px;
	margin-bottom: 20px;
}

h1 {
	font-size: 32px;
	font-weight: bold;
	margin-bottom: 20px;
}

p {
	color: #333;
	margin-bottom: 20px;
}

.error-color {
	background-color: #f04747;
}

.validated-color {
	background-color: #43b581;
}
`;

const cardInfo = {
	validated: {
		color: "validated-color",
		image: "../img/email_success.png",
		header: "Email Verification Success",
		message: "Your email has been successfully verified.",
	},
	invalid: {
		color: "error-color",
		image: "../img/email_fail.png",
		header: "Email Verification Failure",
		message: "Sorry, we couldn't verify your email.",
	},
	active: {
		color: "validated-color",
		image: "../img/email_success.png",
		header: "Email Already Verified",
		message: "Your email has already been verified successfully.",
	},
}

const getHtml = function(data) {
	const info = cardInfo[data.state];
	const html = `
		<div class="mail-info-container ${info.color}">
			<img src="${info.image}" alt="Email Sent Icon" title="Image From Flaticon">
			<h1>${info.header}</h1>
			<p>${info.message}</p>
			<button type="button" class="btn btn-primary btn-home">Go Home</button>
		</div>
	`;
	return html;
}

const title = "BlitzPong - Email Verification";

export default class PageEmailVerification extends HTMLElement {
	static #componentName = "page-email-verification";
	static observedAttributes = ["token"];

	constructor() {
		super()
		this.data = {};
	}

	static get componentName() {
		return this.#componentName;
	}

	connectedCallback() {
		if (!this.data.token)
			render("<page-404></page-404>");
		else {
			replaceCurrentRoute("/email-verification");
			callAPI("POST", `http://127.0.0.1:8000/api/auth/validate-email`, {email_token: this.data.token}, (res, data) => {
				if (res.ok && data)
					this.data["state"] = data.validation_status;
				this.#start();
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
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
		stateManager.setState("pageReady", true);
	}

	#scripts() {
		this.#rediretionToHomeBtn();
	}

	#rediretionToHomeBtn() {
		const btn = this.html.querySelector(".btn-home");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			redirect("/");
		});
	}
}

customElements.define(PageEmailVerification.componentName, PageEmailVerification);

const replaceCurrentRoute = function(route) {
	window.history.replaceState({route: route}, null, route);
}
