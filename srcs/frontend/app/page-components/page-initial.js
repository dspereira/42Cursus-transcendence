import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";
import {colors} from "../js/globalStyles.js";

const styles = `

	.paddle {
		position: absolute;
		width: 25px;
		height: 250px;
		background-color: white;
	}

	#right {
		left: 20px;
		top: 30%;
	}

	#left {
		right: 30px;
		top: 60%;
	}

	.ball {
		position: absolute;
		height: 25px;
		width: 25px;
		border-style: hidden;
		border-radius: 50%;
		left: 30%;
		top: 20%;
		background-color: white;
	}

	.main-container {
		position: absolute;
		display: flex;
		flex-direction: column;
		width: 900px;
		height: 600px;
		justify-content: center;
		align-items: center;
		gap: 100px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -40%);

		border-style: hidden;
		border-radius: 20px;
		color: ${colors.primary_text};
	}

	.title-container {
		display: flex;
		flex-direction: column;
		width: 70%;
	}

	.button-container {
		display: flex;
		width: 100%;
		height: 50px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 200px;
		padding: 0px 20px 0px 20px;
	}

	.logo-img {
		width: 100%;
		height: auto;
	}

	#login, #signup {
		width: 150px;
		font-size: 24px;
		font-weight: bold;
	}

	#login {
		border: 2px solid ${colors.primary_text};
		color: ${colors.primary_text};
		background-color: rgba(0, 0, 0, 0);
	}

	#login:hover {
		border: 2px solid ${colors.button_default};
		background-color: ${colors.button_default};
		color: ${colors.primary_text};
	}

	#signup {
		border: 2px solid ${colors.primary_text};>
		color: ${colors.primary_text};
		background-color: rgba(0, 0, 0, 0);
	}

	#signup:hover {
		border: 2px solid ${colors.button_default};
		background-color: ${colors.button_default};
		color: ${colors.primary_text};
	}

	app-background {
		position: absolute;
		width:100%;
		z-index:1;
	}
`;
//font: workbench

const getHtml = function(data) {
	const html = `
		<div class=main-container>
			<div class=title-container>
				<img src="../img/logo_white_big.png" class=logo-img>
			</div>
			<div class=button-container>
				<button type="button" class="btn btn-primary" id="login">Login</button>
				<button type="button" class="btn btn-secondary" id="signup">SignUp</button>
			</div>
		</div>
		<div class=paddle id=left></div>
		<div class=paddle id=right></div>
		<!--<div class=ball></div>-->

	`;
	return html;
}

const title = "initial Page";

export default class PageInitial extends HTMLElement {
	static #componentName = "page-initial";

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
		const login = this.html.querySelector("#login");
		const signup = this.html.querySelector("#signup");

		login.addEventListener("click", (event) => {
			redirect("/login");
		});

		signup.addEventListener("click", (event) => {
			redirect("/signup"); 
		})
	}
}

customElements.define(PageInitial.componentName, PageInitial);
