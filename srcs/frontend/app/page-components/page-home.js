import AppHeader from "../components/app-header.js";
import AppTest from "../components/app-test.js";


const styles = `
	.user {
		font-size: 24px;
	}
`;

const html = `

<app-header></app-header>
<a href="/login/">Login</a>
<h1>Home Page</h1>
<br><br>
<app-test class="test" message="This Test message is awsome"></app-test>

<h2 class="id"></h1>
<h2 class="username"></h1>
<h2 class="email"></h1>
<span class="user">user: teste</span>

`;


const title = "Home Page";

export default class PageHome extends HTMLElement {
	static #componentName = "page-home";

	constructor() {
		super()
		this.#loadData();
		this.#initComponent();
	}

	#initComponent() {
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		this.html = document.createElement("div");
		this.html.classList.add(`${this.elmtId}`);
		this.styles = document.createElement("style");
		this.styles.textContent = this.#styles();
		this.html.innerHTML = this.#html();
	}

	#styles() {
		return `@scope (.${this.elmtId}) {${styles}}`;
	}

	#html() {
		return html;
	}

	#render() {
		this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#updateHtml() {
		this.html.querySelector(".id").textContent = this.data['id'];
		this.html.querySelector(".username").textContent = this.data['username'];
		this.html.querySelector(".email").textContent = this.data['email'];
		this.html.querySelector(".test").setAttribute("message", this.data['username']);
	}

	#handleApiData(data) {
		this.data = {
			"id": data[1].user_id,
			"username": data[2].username,
			"email": data[3].email
		}
	}

	async #callAPI(method, url) {
		try {
			const res = await fetch(url, {
				credentials: 'include',
				method: method
			});
			const data = await res.json();
			return data;
		}
		catch {
			// very what is the best way to handle this errors
			console.log("Error: Call API");
			return null;
		}
	}

	async #loadData() {
		const data = await Promise.all([
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/info"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/id"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/username"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/email")
		]);
		this.#handleApiData(data);
		this.#updateHtml();
		this.#render();
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageHome.componentName, PageHome);