const styles = `
form {
	position: relative;
}

div {
	//border: 1px solid black;
}

.login-input {
	margin-bottom: 15px;
}

.login-submit {
	margin-top: 50px;
}

.login-submit .btn {
	width: 100%;
}

.login-recover-pass span {
	text-decoration: underline;
	float: right;
}

.icon {
	position: absolute;
	margin-left: 10px;
	margin-top: 3px;
	font-size: 28px;
}

.icon-eye {
	right: 0;
	margin-right: 10px;
}

.login-input input {
	padding-left: 55px;
}

.login-header {
	text-align: center;
	margin-bottom: 30px;
	font-size: 40px; 
}

`;

const html = `
<app-header></app-header>

<a href="/signup/">signup</a>

<div class="row">
  <div class="col-md-4 offset-md-4">

	<h1 class="signup-header">Signup</h1>

	<form id="signup-form">
		<div class="login-input login-email form-group">
			<i class="icon bi-envelope"></i>
			<input type="email" class="form-control form-control-lg" id="email" aria-describedby="emailHelp" placeholder="Email Address">
		</div>
		<div class="login-input login-username form-group">
			<i class="icon bi-person"></i>
			<input type="username" class="form-control form-control-lg" id="username" aria-describedby="emailHelp" placeholder="Username">
		</div>
		<div class="login-input login-password form-group">
			<i class="icon bi bi-key"></i>
			<i class="icon icon-eye bi bi-eye-slash"></i>
			<input type="password" class="form-control form-control-lg" id="password" placeholder="Password">
		</div>
		<div class="login-recover-pass">
			<a><span>Forgot your password ?</span></a>
		</div>
		<div class="login-submit">
			<button type="submit" class="btn btn-primary btn-block">Submit</button>
		</div>
	</form>

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
	
		const dataForm = {
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
		}
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageSignup.componentName, PageSignup);
