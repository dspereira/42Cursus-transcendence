import {redirect} from "../js/router.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="profile"></side-panel>
		<h1>Profile Page</h1>
	`;
	return html;
}


const title = "Profile";

export default class PageProfile extends HTMLElement {
	static #componentName = "page-profile";

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

customElements.define(PageProfile.componentName, PageProfile);
