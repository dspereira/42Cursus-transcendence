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

		this.data = {};

		this.#loadData();
		
		

		console.log(`start component: ${PageHome.#componentName}`);
		document.querySelector("head title").textContent = title;
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		const elmBody = document.createElement("div");
		elmBody.classList.add(`${this.elmtId}`);
		const styles = document.createElement("style");
		styles.textContent = this.#styles();
		elmBody.innerHTML = this.#html();


		this.html = elmBody;
		this.styles = styles;
		//this.appendChild(styles);
		//this.appendChild(elmBody);
		

		/*
		console.log("start component");
		document.querySelector("head title").textContent = title;
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		const elmBody = document.createElement("div");
		elmBody.classList.add(`${this.elmtId}`);
		const styles = document.createElement("style");
		styles.textContent = this.#styles();
		elmBody.innerHTML = this.#html();
		this.appendChild(styles);
		this.appendChild(elmBody);
		this.#script();
		*/

	
	}

	#styles() {
		return `@scope (.${this.elmtId}) {${styles}}`;
	}

	#html() {
		return html;
	}

	#script() {

	}

	#updateData() {

	}

	#render() {
		console.log("Render Page");

		this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#updateHtml() {
		this.html.querySelector(".id").textContent = this.data['id'];
		this.html.querySelector(".username").textContent = this.data['username'];
		this.html.querySelector(".email").textContent = this.data['email'];
		this.html.querySelector(".test").setAttribute("message", this.data['username']);
	}

	async #callAPI(method, url) {
		try {
			const res = await fetch(url, {
				credentials: 'include',
				method: method
			});
			const data = await res.json();
			//console.log(data);
			return data;
		}
		catch {
			console.log("Error: Failed to fetch");
		}
	}

	async #loadData() {
		const [info, id, username, email] = await Promise.all([
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/info"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/id"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/username"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/email")
		]);

		this.data = {
			"id": id.user_id,
			"username": username.username,
			"email": email.email
		}
		this.#updateHtml();
		this.#render();
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageHome.componentName, PageHome);