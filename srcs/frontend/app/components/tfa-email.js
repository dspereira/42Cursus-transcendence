import {callAPI} from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `
p {
	font-size: 22px;
}

.otp-code {
	width: 45px;
	height: 45px;
	text-align: center;
	font-size: 20px;
}

.code-container {
	display: flex;
	gap: 10px;
}

`;

const getHtml = function(data) {
	const html = `
		<p>A code has been sent to your email. Please check it and enter it in the box below.</p>

		<form id="tfa-code">
			<div class="form-group">
				
				<div class="code-container">
				<input type="text" class="input-padding form-control form-control-md otp-code" id="email"  maxlength="1">
				<input type="text" class="input-padding form-control form-control-md otp-code" id="email"  maxlength="1">
				<input type="text" class="input-padding form-control form-control-md otp-code" id="email"  maxlength="1">
				<input type="text" class="input-padding form-control form-control-md otp-code" id="email"  maxlength="1">
				<input type="text" class="input-padding form-control form-control-md otp-code" id="email"  maxlength="1">
				<input type="text" class="input-padding form-control form-control-md otp-code" id="email"  maxlength="1">
				</div>
				
				<!--
				<input type="text" class="input-padding form-control form-control-md otp-code" id="code"  maxlength="6">
				-->
				</div>
			<br></br>
			<div>
				<button type="submit" class="btn btn-primary btn-submit">validate</button>
			</div>

		</form>

		<br></br>
		<button type="button" class="btn btn-primary btn-resend">Resend email</button>
	`;

	return html;
}

export default class TfaEmail extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super();
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
		this.submitBtn = this.html.querySelector(".btn-submit");
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
		this.#sendCodeToEmail();
		this.#resendEmailBtn();
		this.#pasteCode();
		this.#submit();
	}

	#sendCodeToEmail() {
		callAPI("POST", `http://127.0.0.1:8000/api/two-factor-auth/request-email/`, {}, (res, data) => {		
			console.log(res);
			console.log(data);
		});
	}

	#resendEmailBtn() {
		const btn = this.html.querySelector(".btn-resend");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			console.log("resend email");
			this.#sendCodeToEmail();
		});
	}

	#pasteCode() {
		this.html.addEventListener("paste", (event) =>{
			let code;
			if (event.clipboardData)
				code = event.clipboardData.getData("text");
			if (!code)
				return ;
			if (!this.#isValidCode(code))
				return ;

			const inputs = this.html.querySelectorAll(".otp-code");
			if (!inputs || inputs.length < 6)
				return ;

			inputs.forEach((elm, idx) => {
				elm.value = code[idx];
			})
		});
	}

	#isValidCodeDigit(digit) {
		if (digit >= '0' &&  digit <= '9')
			return true;
	}

	#isValidCode(code) {
		if (!code || code.length != 6)
			return false;
		for(let i=0; i < 5; i++) {
			if (!this.#isValidCodeDigit(code[i]))
				return false;
		}
		return true;
	}


	#submit() {
		const tfaForm = this.html.querySelector("#tfa-code");
		tfaForm.addEventListener("submit", (event) => {
			event.preventDefault();
			//this.submitBtn.disabled = true;
			const formData = {
				code: this.html.querySelector('#code').value.trim(),
				method: "email"
			}
			if (!formData.code) {
				// tem de dar erro não tem código, o melhor é o botão começar desabilitado.
			}
			else {
				callAPI("POST", "http://127.0.0.1:8000/api/two-factor-auth/validate-otp/", formData, (res, data) => {		
					console.log(res);
					console.log(data);
				});
			}

		});
	}

}

customElements.define("tfa-email", TfaEmail);
