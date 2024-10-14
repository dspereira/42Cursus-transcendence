import componentSetup from "../utils/componentSetupUtils.js";

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
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);
	}
}

customElements.define(PageLocalPlay.componentName, PageLocalPlay);
