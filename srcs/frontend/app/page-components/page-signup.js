const styles = ``;

const html = `
<!--<app-header></app-header>-->

<a href="/signup/">signup</a>

<div class="row">
  <div class="col-md-4 offset-md-4">
  	<signup-form></signup-form>
  </div>
</div>

`;

const title = "Signup Page";

export default class PageSignup extends HTMLElement {
	
	static #componentName = "page-signup";

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

		let loginForm = document.querySelector("#signup-form");
		loginForm.addEventListener("submit", (event) => {
			event.preventDefault();
			this.#submit();
		});

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

	async #submit(){
	
		/*const dataForm = {
			email: document.getElementById('email').value,
			username: document.getElementById('username').value,
			password: document.getElementById('password').value
		}

		try {
			const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
				credentials: 'include',
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(dataForm)
			});
			const data = await res.json();
			console.log(data);
		}
		catch {
			console.log("Error: Failed to fetch");
		}*/
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageSignup.componentName, PageSignup);
