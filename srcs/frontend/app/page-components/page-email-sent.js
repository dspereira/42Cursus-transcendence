import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";

const styles = `
.mail-info-container {
	max-width: 400px;
	padding: 30px;
	border-radius: 8px;
	text-align: center;
	margin: 50px auto 0px auto;
	background-color: #ca9400;
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
`;

const getHtml = function(data) {
	const html = `
	<div class="mail-info-container">
		<img src="../img/email_sended.png" alt="Email Sent Icon" title="Image From Flaticon">
		<h1>Email Verification Sended</h1>
		<p>Verification email was sended. Please check your email box.</p>
		<button type="button" class="btn btn-primary btn-home">Go Home</button>
	</div>
	`;
	return html;
}

const title = "Email Send";

export default class PageEmailSent extends HTMLElement {
	static #componentName = "page-email-send";

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

customElements.define(PageEmailSent.componentName, PageEmailSent);
