import { redirect } from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import componentSetup from "../utils/componentSetupUtils.js";


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
			<!--<img src="" class="profile-photo"  alt="avatar"/>-->
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
		this.#initComponent();
		
		const userImage = stateManager.getState("userImage");
		if (userImage)
			this.#createImgTag(userImage);

		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		this.#getUserImage();
		this.#addPageRedirection("home", "logo");
	}

	#addPageRedirection(page, classIdentifier) {
		const elm = this.html.querySelector(`.${classIdentifier}`);
		if (!elm)
			return ;
		if (page === "/home" || page === "home")
			page = "";
		elm.addEventListener("click", () => redirect(`/${page}`));		
	}

	#createImgTag(imageSrc) {
		const elmHtml = this.html.querySelector(".right-side");
		if (!elmHtml)
			return ;
		elmHtml.innerHTML = `<img src="${imageSrc}" class="profile-photo"  alt="avatar"/>`;
		this.#addPageRedirection("profile", "profile-photo");
	}

	#getUserImage() {
		callAPI("GET", "http://127.0.0.1:8000/api/profile/image", null, (res, data) => {
			if (res.ok) {
				if (data && data.image) {
					if (stateManager.getState("userImage") != data.image) {
						this.#createImgTag(data.image);
						stateManager.setState("userImage", data.image);
					}
				}
			}
		});
	}
}

customElements.define("app-header", AppHeader);