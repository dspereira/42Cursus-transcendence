import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";
import {colors} from "../js/globalStyles.js";
import componentSetup from "../utils/componentSetupUtils.js";

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
		position: fixed;
		z-index: 1001;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		justify-content: center; 
		align-items: center;
	}

	.second-container {
		position: relative;
		display: flex;
		flex-direction: column;
		max-width: 900px;
		min-width: 460px;
		height: 80%;
		max-height: 600px;
		justify-content: center;
		align-items: center;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		color: ${colors.primary_text};
		z-index: 1001;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		width: auto;
		max-height: 80vh;
	}

	.button-container {
		display: flex;
		width: 100%;
		height: 50px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 15%;
		padding: 0px 20px 0px 20px;
	}

	.logo-img {
		max-width: 100%;
		max-height: 100%;
	}

	#login, #signup, #localplay {
		width: 150px;
		font-size: 24px;
		font-weight: bold;
	}

	#login, #signup, #localplay {
		border: 2px solid ${colors.primary_text};
		color: ${colors.primary_text};
		background-color: rgba(0, 0, 0, 0);
	}

	#login:hover, #signup:hover, #localplay:hover {
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

	.alert-div {
		display: flex;
		margin: 30px auto;
		width: 80%;
		margin: 20px auto;
		animation: disappear linear 5s forwards;
		background-color: ${colors.alert};
		color: ${colors.alert_text};
		z-index: 1001;
	}
	
	.alert-bar {
		width: 95%;
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
			width: 95%;
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
//font: workbench

const getHtml = function(data) {
	const html = `
	<div class=main-container>
		<div class=second-container>
			<div class=title-container>
				<img src="../img/pong-2k.png" class=logo-img>
			</div>
			<div class=button-container>
				<button type="button" class="btn btn-primary" id="login">Login</button>
				<button type="button" class="btn btn-secondary" id="signup">SignUp</button>
				<button type="button" class="btn btn-secondary" id="localplay">Local Play</button>
			</div>
		</div>
		<div class=ball></div>
		<div class=paddle id=left></div>
		<div class=paddle id=right></div>
		<div class="blur-test"></div>
	</div>
	`;
	return html;
}

const title = "BlitzPong - Initial Page";

export default class PageInitial extends HTMLElement {
	static #componentName = "page-initial";

	constructor() {
		super()

		this.#initComponent();
		this.#scripts();
		this.#errorMsgEvents();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		document.title = title;
		this.html = componentSetup(this, getHtml(), styles);
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

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				stateManager.setState("errorMsg", null);
				const mainDiv = this.html.querySelector(".main-container");
				if (!mainDiv)
					return ;
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = mainDiv.querySelector(".second-container");
				if (!insertElement)
					return ;
				let alertCard = document.createElement("div");
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

customElements.define(PageInitial.componentName, PageInitial);
