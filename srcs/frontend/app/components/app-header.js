import { redirect } from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `

header {
	position: fixed;
	top: 0;
	display: flex;
    justify-content: space-between;
    align-items: center;
	width: 100%;
	height: 56px;
	padding: 8px 25px 0px 20px;
}

.left-side {
	display: flex;
	align-items: center;
	gap: 3px;
	margin-left: 48px;
}

.logo {
	position: absolute;
	cursor: pointer;
}

.logo-img {
	width: 30px;
}

.logo-text {
	font-size: 16px;
}

.right-side {
	display: flex;
	align-items: center;
	gap: 30px;
}

.profile-photo {
	width: 45px;
	height: auto;
	clip-path:circle();
	cursor: pointer;
}

.number {
	position: fixed;
	right: 112px;
    display: inline-block;
    border-radius: 3px;
    background-color: red; 
    text-align: center;
	font-weight: bold;
    color: white; 
    font-size: 9px;
	padding: 0px 2px 0px 2px;
}

`;

const getHtml = function(data) {
	const html = `
	<header>
		<div class="left-side">
			<div class= "logo">
				<img src="/img/logo.png" class="logo-img" alt="logo">
				<span class="logo-text"><strong>BlitzPong</strong></span>
			</div>
		</div>
		<div class="right-side">
			<img src="${data.userImage}" class="profile-photo"  alt="avatar"/>
		</div>
	</header>
	`;
	return html;
}

export default class AppHeader extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super();
		this.data = {};
	}

	connectedCallback() {
		const userImage = stateManager.getState("userImage");
		if (userImage)
			this.data["userImage"] = userImage;
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

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
	}

	#scripts() {
		this.#getUserImage();
		this.#addPageRedirection("profile", "profile-photo");
		this.#addPageRedirection("home", "logo");
	}

	#addPageRedirection(page, classIdentifier) {
		const elm = this.html.querySelector(`.${classIdentifier}`);
		if (page === "/home" || page === "home")
			page = "";
		elm.addEventListener("click", () => redirect(`/${page}`));		
	}

	#getUserImage() {
		callAPI("GET", "http://127.0.0.1:8000/api/profile/image", null, (res, data) => {
			if (res.ok) {
				const imageSaved = stateManager.getState("userImage");
				const image = this.html.querySelector(".profile-photo");

				if (image && data.image) {
					if (imageSaved != data.image) {
						stateManager.setState("userImage", data.image);
						image.setAttribute("src", `${data.image}`);
					}
				}
			}
		});
	}
}

customElements.define("app-header", AppHeader);