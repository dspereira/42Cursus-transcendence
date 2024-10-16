import componentSetup from "../utils/componentSetupUtils.js";
import { redirect } from "../js/router.js";
import { colors } from "../js/globalStyles.js";

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
	max-width: 60%;
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

.btn-primary {
	border: 2px solid ${colors.primary_text};
	color: ${colors.primary_text};
	background-color: rgba(0, 0, 0, 0);
}

.btn-primary:hover {
	border: 2px solid ${colors.btn_default};
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.msg-container {
	align-items: center;
	margin-bottom: 30px;
	font-size: 32px;
	font-weight: bold;
}

.logo-img {
	max-width: 100%;
	max-height: 100%;
	opacity: 0.5;
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


`

;

const getHtml = function(data) {
	const html = `	
	<div class=main-container>
		<div class=second-container>
			<div class=title-container>
				<img src="../img/pong-2k.png" class=logo-img>
			</div>
			<div class="msg-container"> Server is down, please try again later </div>
			<div class=button-container>
				<button type="button" class="btn btn-primary btn-home">Go Home</button>
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

const title = "BlitzPong - Server Error";

export default class PageError extends HTMLElement {
	static #componentName = "page-error";

	constructor() {
		super()
		document.title = title;
		this.#initComponent();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);
	}

	#scripts() {
		this.#goHomeBtnEvent();
	}

	#goHomeBtnEvent() {
		const btn = this.html.querySelector(".btn-home");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			location.reload();
		});
	}
}

customElements.define(PageError.componentName, PageError);
