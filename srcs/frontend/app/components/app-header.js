import { redirect } from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import {colors} from "../js/globalStyles.js"

const styles = `

header {
	position: fixed;
	top: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 56px;
	padding: 10px 20px 10px 20px;
	background-color: ${colors.page_background};
	z-index: 99;
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
	height: 30px;
}

.logo-text {
	font-size: 16px;
	color: ${colors.second_text};
}

.right-side {
	display: flex;
	align-items: center;
	gap: 30px;
	color: ${colors.second_text};
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

.hover-popup {
	position: fixed;
	padding: 10px;
	background-color: ${colors.main_card};
	color: ${colors.primary_text};
	opacity: 0.9;
	border-radius: 5px;
	white-space: nowrap;
	display: none;
	pointer-events: none;
	z-index: 1000;
	transform: translate(-40px, 40px);
}
`;

const getHtml = function(data) {
	const html = `
	<header>
		<div class="left-side">
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
		this.#render();
		
		const userImage = stateManager.getState("userImage");
		if (userImage)
			this.#createImgTag(userImage);

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
	}

	#addPageRedirection(page, classIdentifier, elmHtml) {
		const elm = this.html.querySelector(`.${classIdentifier}`);
		if (!elm)
			return ;
		const popup = elmHtml.querySelector('.my-profile');
		elm.addEventListener('mouseenter', () => popup.style.display = 'block');
		elm.addEventListener('mouseleave', () => popup.style.display = 'none');
		if (page === "/home" || page === "home")
			page = "";
		elm.addEventListener("click", () => redirect(`/${page}`));
	}

	#createImgTag(imageSrc) {
		const elmHtml = this.html.querySelector(".right-side");
		if (!elmHtml)
			return ;
		elmHtml.innerHTML = `
			<img src="${imageSrc}" class="profile-photo"  alt="avatar"/>
			<div id="hover-popup" class="hover-popup my-profile">My profile</div>`;
		this.#addPageRedirection("profile", "profile-photo", elmHtml);

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