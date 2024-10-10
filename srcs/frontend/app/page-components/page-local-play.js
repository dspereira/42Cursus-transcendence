import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<local-game></local-game>
	`;
	return html;
}


const title = "BlitzPong - LocalPlay";

export default class PageLocalPlay extends HTMLElement {
	static #componentName = "page-local-play";

	constructor() {
		super()

		document.title = title;

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
		stateManager.setState("pageReady", true);
	}
}

customElements.define(PageLocalPlay.componentName, PageLocalPlay);
