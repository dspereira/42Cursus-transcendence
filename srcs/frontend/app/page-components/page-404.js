import stateManager from "../js/StateManager.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<a href="/">Home</a>
		<h1>404 Not Found</h1>
	`;
	return html;
}

const title = "404 Not Found";

export default class Page404 extends HTMLElement {

	static #componentName = "page-404";

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
		stateManager.setState("pageReady", true);
	}

}

customElements.define(Page404.componentName, Page404);
