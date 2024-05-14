import {redirect} from "../js/router.js";


const styles = `

header {
	display: flex;
    justify-content: space-between;
    align-items: center;
	width: 100%;
	padding: 15px 20px 0px 20px;
}

.left-side {
	display: flex;
	align-items: center;
	gap: 12px;
}

.logo-img {
	width: 45px;
}

.logo-text {
	font-size: 22px;
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
}

.bell {
	font-size: 22px;
}

`;


const getHtml = function(data) {
	const html = `
	
	<header>
		<div class="left-side">
			<img src="/img/logo.png" class="logo-img" alt="logo">
			<span class="logo-text"><strong>BlitzPong</strong></span>
		</div>

		<div class="right-side">
			<i class="bell bi bi-bell"></i>
			<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo"  alt="avatar"/>
		</div>
	</header>

	`;
	return html;
}

export default class AppHeader extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

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

	#scripts() {

	}

}

customElements.define("app-header", AppHeader);