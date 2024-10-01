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

	#left {
		left: 20px;
		top: 30%;
	}

	#right {
		right: 30px;
		top: 60%;
	}

	.ball {
		position: absolute;
		height: 25px;
		width: 25px;
		border-style: hidden;
		border-radius: 50%;
		right: 15%;
		bottom: 30%;
		background-color: white;
	}

	.main-container {
		display: fixed;
		width: 100vw;
		min-width: 460px;
		height: 100vh;
		justify-content: center;
		z-index: 1001;
		top: 0px;
		right: 0px;
	}

	.second-container {
		position: relative;
		display: flex;
		flex-direction: column;
		max-width: 900px;
		min-width: 460px;
		max-height: 600px;
		justify-content: center;
		align-items: center;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -40%);

		border-style: hidden;
		border-radius: 20px;
		color: ${colors.primary_text};
		z-index: 1001;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		width: 90%;
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
		border: 2px solid ${colors.btn_default};
		background-color: ${colors.btn_default};
		color: ${colors.primary_text};
	}

	#signup {
		border: 2px solid ${colors.primary_text};>
		color: ${colors.primary_text};
		background-color: rgba(0, 0, 0, 0);
	}

	#signup:hover {
		border: 2px solid ${colors.btn_default};
		background-color: ${colors.btn_default};
		color: ${colors.primary_text};
	}

	app-background {
		position: absolute;
		width:100%;
		z-index:1;
	}

	.blur-test {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		justify-content: center; 
		align-items: center;
		z-index: 1000;
	}
`;
//font: workbench

const getHtml = function(data) {
	const html = `
<<<<<<< HEAD
	<div class=main-container>
	<div class=second-container>
			<div class=title-container>
				<img src="../img/Pong.png" class=logo-img>
			</div>
			<div class=button-container>
				<button type="button" class="btn btn-primary" id="login">Login</button>
				<button type="button" class="btn btn-secondary" id="signup">SignUp</button>
			</div>
		</div>
		<div class=ball></div>
		<div class=paddle id=left></div>
		<div class=paddle id=right></div>
		<div class="blur-test"></div>
	</div>
=======
		<h1>Initial Page</h1>
		<br>
		<button type="button" class="btn btn-primary" id="login">Login</button>
		<button type="button" class="btn btn-secondary" id="signup">SignUp</button>
		<button type="button" class="btn btn-secondary" id="localplay">Local Play</button>
>>>>>>> main
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
		const localplay = this.html.querySelector("#localplay");

		login.addEventListener("click", (event) => {
			redirect("/login");
		});

		signup.addEventListener("click", (event) => {
			redirect("/signup"); 
		})

		localplay.addEventListener("click", (event) => {
			redirect("/localplay"); 
		})
	}
}

customElements.define(PageInitial.componentName, PageInitial);
