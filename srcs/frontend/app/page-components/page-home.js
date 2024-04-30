import AppHeader from "../components/app-header.js";

const styles = `


`;

const html = `
<app-header></app-header>

<a href="/login/">Login</a>

<h1>Home Page</h1>

`;


const title = "Home Page";

export default class PageHome extends HTMLElement {
	static #componentName = "page-home";

	constructor() {
		super()
		console.log("start component");
		document.querySelector("head title").innerHTML = title;
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		const elmBody = document.createElement("div");
		elmBody.classList.add(`${this.elmtId}`);
		const styles = document.createElement("style");
		styles.textContent = this.#styles();
		elmBody.innerHTML = this.#html();
		this.appendChild(styles);
		this.appendChild(elmBody);
		this.#script();
	}

	static get componentName() {
		return this.#componentName;
	}

	#styles() {
		return `@scope (.${this.elmtId}) {${styles}}`;
	}

	#html(){
		return html;
	}

	#script(){

	}

}

customElements.define(PageHome.componentName, PageHome);