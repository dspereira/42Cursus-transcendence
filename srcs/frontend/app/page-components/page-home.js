import AppHeader from "../components/app-header.js";

const page = 
`
<style>

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

</style>


<app-header></app-header>

<a href="/login/">login</a>

<div class="row">
  <div class="col-md-4 offset-md-4">

	<h1 class="login-header">Login</h1>

	<form>
		<div class="login-input login-email form-group">
			<i class="icon bi-person"></i>
			<input type="email" class="form-control form-control-lg" id="email" aria-describedby="emailHelp" placeholder="Email Address">
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

const title = "Home Page";

export default class PageHome extends HTMLElement {

	static #componentName = "page-home";

	constructor() {
		super()
		this.innerHTML = page;
		document.querySelector("head title").innerHTML = title;

		const eyeIcon = {
			open: "bi-eye",
			close: "bi-eye-slash"
		}
		let input = document.querySelector(".login-password input");
		let eye = document.querySelector(".icon-eye");
		eye.addEventListener("click", event => {
			eye.classList.toggle(eyeIcon.open);
			eye.classList.toggle(eyeIcon.close);
			if (input.type === "password")
				input.type = "text";
			else
				input.type = "password";
		});

	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageHome.componentName, PageHome);
