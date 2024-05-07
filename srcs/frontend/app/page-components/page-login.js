import {redirect} from "../js/router.js";

const styles = `
/*a {
	text-decoration: none;
	color: inherit;
	font-size: 24px;
	display: block;
}

.section-signin {
	border-right: 1px solid black;
	border-bottom: 1px solid black;
}

.section-signup {
	border-left: 1px solid black;
	border-bottom: 1px solid black;	
}

.signin {
    text-align: right;
	margin-right: 60px;
}

.signup {
    text-align: left;
	margin-left: 60px;
}*/

`;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<div class="row">
	  <div class="col-md-4 offset-md-4">

		<!--
		<div class="header row">
			<div class="col-md section-signin">
				<a class="signin">Sign in</a>
			</div>
			<div class="col-md section-signup">
				<a class="signup">Sign up</a>
			</div>
		
		</div>
		-->

		<login-form></login-form>
	  </div>
	</div>
	`;
	return html;
}


const title = "Login Page";

export default class PageLogin extends HTMLElement {
	static #componentName = "page-login";

	constructor() {
		super()
		this.#initComponent();
		this.#render();

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
	}
}

customElements.define(PageLogin.componentName, PageLogin);
