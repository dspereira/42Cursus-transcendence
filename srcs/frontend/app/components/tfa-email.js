import {callAPI} from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `
.tfa-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.tfa-elements {
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	padding: 20px;
	background-color: #D3D3D3;
	border-radius: 8px;
}

p {
	font-size: 22px;
	margin: 0;
	padding: 0;
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

.btn-resend {
	background: none;
	border: none;
	color: blue;
	cursor: pointer;
	padding: 0;
	font: inherit;
	width: 100%;
	display: flex;
	margin-top: 10px;
}

.submit-container {
	width: 100%;
	display: flex;
	justify-content: flex-end;
	margin-top: 10px;
}

`;

const getHtml = function(data) {
	const html = `
		<div class="tfa-container">
			<div class="tfa-elements">
				<p>A code has been sent to your email. Please check it and enter it in the box below.</p>
				<form id="tfa-code">
					<div class="form-group">
						<div class="code-container">
						<input type="text" class="input-padding form-control form-control-md otp-code" id="idx-0" maxlength="1">
						<input type="text" class="input-padding form-control form-control-md otp-code" id="idx-1" maxlength="1">
						<input type="text" class="input-padding form-control form-control-md otp-code" id="idx-2" maxlength="1">
						<input type="text" class="input-padding form-control form-control-md otp-code" id="idx-3" maxlength="1">
						<input type="text" class="input-padding form-control form-control-md otp-code" id="idx-4" maxlength="1">
						<input type="text" class="input-padding form-control form-control-md otp-code" id="idx-5" maxlength="1">
					</div>
					<button class="btn-resend">Resend code</button>
					<div class="submit-container">
						<button type="submit" class="btn btn-primary btn-submit">submit</button>
					<div>
				</form>
				<!--<button type="button" class="btn btn-primary btn-resend">Resend email</button>-->
			<div>
		<div>
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
		this.inputs = this.html.querySelectorAll(".otp-code");
		this.resendCodeBtn = this.html.querySelector(".btn-resend");
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
		this.#writeKeys();
		this.#toggleSubmitBtnDisabledBasedOnInput();
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

			if (!this.inputs || this.inputs.length < 6)
				return ;

			this.inputs.forEach((elm, idx) => { 
				elm.value = code[idx];
			});
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
			const formData = {
				code: this.#getCodeValue(),
				method: "email"
			}
			this.#removeAllInputValues();
			this.#removeFocus();
			this.#toggleSubmitBtnDisabledBasedOnInput();
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

	#writeKeys() {
		document.addEventListener("keyup", (event) => {
			this.#cleanNonNumericInputs();

			if (event.key.toLowerCase() == "escape") {
				this.#removeAllInputValues();
				this.#removeFocus();
			}
			if (event.key.toLowerCase() == "backspace")
				this.#moveBackward();
			this.#toggleSubmitBtnDisabledBasedOnInput();

			const value = event.key;
			if (!value || value < '0' || value > '9')
				return ;
			
			const idx = parseInt(this.#getInputIdxToWrite());
			if (idx == 0)
				this.#removeAllInputValues();
			this.inputs[idx].value = value;
			if (idx < 5)
				this.inputs[idx+1].focus();
			else if (idx == 5)
				this.inputs[idx].blur();
			this.#toggleSubmitBtnDisabledBasedOnInput();
		});
	}

	#getInputIdxToWrite() {
		let elm = document.activeElement;
		let i = 0;
		if (elm.tagName.toLowerCase() == "input")
			i = elm.id.substring("idx-".length);
		return i;
	}

	#removeAllInputValues() {
		this.inputs.forEach((elm) => {
			elm.value = "";
		});
	}

	#moveBackward() {
		for(let i = 5; i >= 0; i--) {
			if (this.inputs[i].value != "") {
				this.inputs[i].value = "";
				this.inputs[i].focus();
				return ;
			}
		}
	}

	#cleanNonNumericInputs() {
		this.inputs.forEach((elm) => {
			if (elm.value < "0" || elm.value > "9")
				elm.value = "";
		});
	}

	#toggleSubmitBtnDisabledBasedOnInput() {
		this.submitBtn.disabled=false;
		this.inputs.forEach((elm) => {
			if (elm.value < "0" || elm.value > "9") {
				this.submitBtn.disabled=true;
				return ;
			}
		});
	}

	#removeFocus() {
		let elm = document.activeElement;
		if (elm.tagName.toLowerCase() == "input")
			elm.blur();
	}

	#getCodeValue() {
		let code = ""; 
		this.inputs.forEach((elm) => {
			if (elm.value >= "0" || elm.value <= "9") {
				code += elm.value;
			}
		});
		return code.trim();
	}
}

customElements.define("tfa-email", TfaEmail);
