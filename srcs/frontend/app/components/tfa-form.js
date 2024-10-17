import {callAPI} from "../utils/callApiUtils.js";
import { redirect } from "../js/router.js";
import { colors } from "../js/globalStyles.js";
import stateManager from "../js/StateManager.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
.tfa-container {
	width: 100%;
	min-width: 460px;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 10px;
}

.tfa-elements {
	width: 50%;
	min-width: 420px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	padding: 20px;
	background-color: ${colors.second_card};
	color: ${colors.primary_text};
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
	color: ${colors.btn_default};
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
	justify-content: center;
	margin-top: 30px;
}

.code-invalid {
	border: 2px solid #dc3545;
}


.form-control {
	border-radius: 5px;
	border-style: hidden;
	background-color: ${colors.input_background};
	color: ${colors.second_text};
}

.form-control::placeholder {
	color: ${colors.second_text};
}

.form-control:focus {
	background-color: ${colors.input_background};
	color: ${colors.second_text};
}

.search input {
	padding-left: 30px;
	color:  ${colors.second_text};
}

.form-control + input:focus {
	color:  ${colors.second_text};
}

.btn-primary:not(disabled) {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.btn-primary:not(:disabled):hover {
	background-color: ${colors.btn_hover};
	color: ${colors.second_text};
}

.btn-primary:disabled {
	background-color: ${colors.main_card};
	cursor: not-allowed;
	border-style: hidden;
}

.btn-submit {
	width: 70%;
}

.2fa-text {
}




`;

const QRCODE_METHOD = "qr_code";

const getHtml = function(data) {
	let infoMsg;
	if (data.method == "email")
		infoMsg = "A code has been sent to your email. Please check it and enter it in the box below.";
	else if (data.method == "phone")
		infoMsg = "A code has been sent to your mobile phone via SMS. Please check your messages and enter it in the box below.";
	else
		infoMsg = "Please check your authentication app and enter the generated code in the box below.";

	const html = `
		<div class="tfa-container">
			<div class="tfa-elements">
				<div class="2fa-text">${infoMsg}</div>
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
					${data.method != QRCODE_METHOD ? '<button class="btn-resend">Resend code</button>' : ""}
					<div class="submit-container">
						<button type="submit" class="btn btn-primary btn-submit">submit</button>
					<div>
				</form>
			<div>
		<div>
	`;
	return html;
}

export default class TfaForm extends HTMLElement {
	static observedAttributes = ["method"];

	constructor() {
		super();
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	disconnectedCallback() {
		document.removeEventListener("keyup", this.#keyUpHandler);
		document.removeEventListener("keydown", this.#keyEnterHandler);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);

		this.submitBtn = this.html.querySelector(".btn-submit");
		this.inputs = this.html.querySelectorAll(".otp-code");
	}

	#scripts() {
		if (this.data.method != QRCODE_METHOD)
			this.#sendTwoFactorCode(this.data.method);
		this.#resendEmailBtn();
		this.#pasteCode();
		this.#submit();
		this.#writeKeys();
		this.#submitKey();
		this.#toggleSubmitBtnDisabledBasedOnInput();
	}

	#sendTwoFactorCode(destination) {
		callAPI("POST", `/two-factor-auth/request-${destination}/`, null, (res, data) => {		
			if (!res.ok)
				stateManager.setState("errorMsg", data.message);
			const btn = this.html.querySelector(".btn-resend");
			if(btn)
				btn.disabled = false;
		});
	}

	#resendEmailBtn() {
		const btn = this.html.querySelector(".btn-resend");
		if (!btn)
			return ;
		btn.addEventListener("click", (event) => {
			event.preventDefault();
			btn.disabled = true;
			if (this.data.method != QRCODE_METHOD)
				this.#sendTwoFactorCode(this.data.method);
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
			this.submitBtn.disabled = true;
			const formData = {
				code: this.#getCodeValue(),
				method: this.data.method
			}
			this.#toggleSubmitBtnDisabledBasedOnInput();
			if (!formData.code){
				this.#updateInvalidCodeStyle(true);
				return ;
			}
			else {
				callAPI("POST", "/two-factor-auth/validate-otp/", formData, (res, data) => {		
					if (res.ok)
						redirect("/");
					else if (res.status == 401)
					{
						redirect("/");
						setTimeout( () => {
							stateManager.setState("errorMsg", data.message);
						}, 200);
					}
					else if (res.status == 409)
						stateManager.setState("errorMsg", data.message);
					// caso dê 401 colocar mensagem no frontend
					this.#updateInvalidCodeStyle(true);
					this.submitBtn.disabled = false;
				});
			}
		});
	}

	#backspaceKey(keyPressed) {
		if (keyPressed.toLowerCase() == "escape") {
			this.#removeAllInputValues();
			this.#removeFocus();
			this.#updateInvalidCodeStyle(false);
		}
	}

	#escapeKey(keyPressed) {
		if (keyPressed.toLowerCase() == "backspace") {
			this.#moveBackward();
			this.#updateInvalidCodeStyle(false);
		}
	}

	#numbersKey(keyPressed) {
		if (!keyPressed || keyPressed < '0' || keyPressed > '9')
			return ;
		this.#updateInvalidCodeStyle(false);
		const idx = parseInt(this.#getInputIdxToWrite());
		if (idx == 0)
			this.#removeAllInputValues();
		this.inputs[idx].value = keyPressed;
		if (idx < 5)
			this.inputs[idx+1].focus();
		else if (idx == 5)
			this.inputs[idx].blur();
	}

	#keyUpHandler = (event) => {
		this.#cleanNonNumericInputs();
		this.#backspaceKey(event.key);
		this.#escapeKey(event.key);
		this.#numbersKey(event.key);
		this.#toggleSubmitBtnDisabledBasedOnInput();
	}

	#writeKeys() {
		document.addEventListener("keyup", this.#keyUpHandler);
	}

	#keyEnterHandler = (event) => {
		if (event.key.toLowerCase() == "enter") {
			if(!this.submitBtn.disabled)
				this.html.querySelector("#tfa-code").requestSubmit();
		}
	};

	#submitKey() {
		document.addEventListener("keydown", this.#keyEnterHandler);
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
		let idx = 5;
		let elm = document.activeElement;
		if (elm.tagName.toLowerCase() == "input")
			idx = parseInt(elm.id.substring("idx-".length));
		this.inputs[idx].value = "";
		if (idx > 0)
			this.inputs[idx-1].focus();
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
			if (elm.value >= "0" || elm.value <= "9")
				code += elm.value;
		});
		return code.trim();
	}

	#updateInvalidCodeStyle(setInvalid) {
		this.inputs.forEach((elm) => {
			if (setInvalid)
				elm.classList.add("code-invalid");
			else
				elm.classList.remove("code-invalid");
		});
	}
}

customElements.define("tfa-form", TfaForm);
