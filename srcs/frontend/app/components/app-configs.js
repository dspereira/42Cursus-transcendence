import { callAPI } from "../utils/callApiUtils.js";
import isValidUsername from "../utils/usernameValidationUtils.js";
import getCountryCodesOptions from "../utils/countryCodesUtils.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js"
import componentSetup from "../utils/componentSetupUtils.js";
import { enAppConfigs } from "../lang-dicts/enLangDict.js";
import { ptAppConfigs } from "../lang-dicts/ptLangDict.js";
import { esAppConfigs } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
.main-container {
	display: flex;
	gap: 10px;
	width: 100%;
}

.general-settings-container {
	width: 70%;
}

.image-settings-container {
	dispay: flex;
	flex-direction: column; 	
	justify-content: center;
	width: 30%;
}

.img-container {
	display: flex;
	justify-content: center;
}

.image-preview {
	width: 100%;
	height: auto;
	clip-path:circle();
	max-width: 300px;
}

.img-buttons {
	display: flex;
	justify-content: center;
	width: 100%;
	gap: 2%;
}

.btn-img {
	width: 50%;
	max-width: 150px;
	font-size: clamp(0.5rem, 1vw, 1rem);
}

legend {
	font-size: 16px
}

#new-username, #new-bio, #theme-options, #language-options, #phone-number-input {
	background-image: none;
}

.hide {
	display: none;
}

.phone-container {
	display: flex;
}

.country-code {
	width: 20%;
}

.phone-number {
	width: 80%;
}

#country-code-select {
	background-color: #E9ECEF;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

#phone-number-input {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

.show-qrcode {
	background: none;
	border: none;
	color: blue;
	cursor: pointer;
	padding: 0;
	font: inherit;
}

.qrcode-img {
	dispay: inline-block;
}

.hide {
	display: none;
}
`;

const getHtml = function(data) {
	const html = `
	<form id="settings-form">
		<div class="main-container">
			<div class="general-settings-container">
				<div class="alert alert-danger hide" role="alert"></div>
				<div class="alert alert-success hide" role="alert"></div>
				<h2>${data.langDict.profile_settings_header}</h2>
				<hr>
				<label for="new-username">${data.langDict.new_username_label}</label>
				<input type="text" class="form-control form-control-md" id="new-username" placeholder="${data.langDict.new_username_placeholder}" maxlength="15">
				<label for="new-bio">${data.langDict.new_bio_label}</label>
				<textarea type="text" class="form-control form-control-md" id="new-bio" placeholder="${data.langDict.new_bio_placeholder}" rows="3" maxlength="255"></textarea>

				<h2>${data.langDict.security_settings_header}</h2>
				<hr>
				<fieldset>
					<legend>${data.langDict.security_settings_legend}</legend>
					<div class="form-check">
						<input class="form-check-input" checked type="checkbox" value="email" id="email">
						<label class="form-check-label" for="email">Email</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="qrcode" id="qrcode">
						<label class="form-check-label" for="qrcode">QR Code</label>
						<button class="show-qrcode hide">Show Qrcode</button>
						<img src="" class="qrcode-img hide" alt="Qrcode image"></img>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="phone" id="phone">
						<label class="form-check-label" for="phone">${data.langDict.security_phone_label}</label>
					</div>

					<div class="phone-container hide">
						<div class="country-code">
							<select class="form-select" id="country-code-select" aria-label="Country Code">
							${getCountryCodesOptions()}
							</select>
						</div>
						<div class="phone-number">
							<input class="form-control form-control-md" id="phone-number-input" type="text">
						</div>
					<div>

				</fieldset>

				<h2>${data.langDict.game_settings_header}</h2>
				<hr>
				<label for="theme-options">${data.langDict.game_theme_label}</label>
				<select class="form-select" id="theme-options" aria-label="Game theme selection">
					<option value="0" selected>Classic Retro</option>
					<option value="1">Modern Neon</option>
					<option value="2">Ocean Vibes</option>
					<option value="3">Sunset Glow</option>
					<option value="4">Forest Retreat</option>
				</select>
			
				<h2>${data.langDict.language_settings_header}</h2>
				<hr>
				<label for="language-options">${data.langDict.language_label}</label>
				<select class="form-select" id="language-options" aria-label="Language selection">
					<option value="en">English &#x1F1EC;&#x1F1E7;</option>
					<option value="pt">Português &#x1F1F5;&#x1F1F9;</option>
					<option value="es">Español &#x1F1EA;&#x1F1F8;</option>
				</select>

				<div><button type="submit" class="btn btn-primary btn-submit">${data.langDict.apply_changes_button}</button></div>
			</div>

			<div class="image-settings-container">
				<div class="img-container">
					<img src="../img/default_profile.png" class="image-preview" alt="Preview of the Image to be Changed">
				</div>
				<div class="img-buttons">
					<label for="new-image" class="btn btn-primary btn-img">${data.langDict.upload_image_button}</label>
					<input id="new-image" class="hide" type="file" accept="image/png, image/jpeg, image/webp">
					<button class="btn btn-primary btn-img btn-new-seed">${data.langDict.new_avatar_button}</button>
				</div>
			</div>
		</div>
	</form>
	`;
	return html;
}

const IMG_PATH = "https://api.dicebear.com/8.x/bottts/svg?seed=";
const MEGABYTE = 1048576;
const MAX_IMAGE_SIZE_BYTES = 1 * MEGABYTE;

const fileTypes = {
	"image/jpeg": true,
	"image/png": true,
	"image/webp": true
}

const isFalidFormat = function(type) {
	if (fileTypes[type])
		return true;
	return false;
}

const suportedFileTypesToString = function() {
	const length = Object.keys(fileTypes).length;

	let result = "";
	let idx = 0;
	for (let key in fileTypes) {
		if (idx < length - 1)
			result += ` ${key},`;
		else
			result += ` ${key}`;
		idx++;
	}
	return result;
} 

export default class AppConfigs extends HTMLElement {
	static observedAttributes = ["language"];
	
	constructor() {
		super()
		this.data = {};
		this.countryBufferStr;
		this.qrcodeConfigured = false;
		this.imageSeed = "";
		this.imageFile = "";
		this.savedImageUrl;
	}

	connectedCallback() {
		this.messages = {
			"success": this.data.langDict.success,
			"usernameInvalid": this.data.langDict.username_invalid,
			"imageSize": `${this.data.langDict.image_size} ${MAX_IMAGE_SIZE_BYTES / MEGABYTE}MB`,
			"imageType": `${this.data.langDict.image_type}${suportedFileTypesToString()}`
		}
		this.#initComponent();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "language") {
			this.data.langDict = getLanguageDict(newValue, enAppConfigs, ptAppConfigs, esAppConfigs);
			this.data.language = newValue;
		}
	}

	disconnectedCallback() {
		if (this.savedImageUrl)
			URL.revokeObjectURL(this.savedImageUrl);
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
		this.settingsForm = this.html.querySelector("#settings-form");
		this.usernameInp = this.html.querySelector("#new-username");
		this.bioInp = this.html.querySelector("#new-bio");
		this.gameThemeOption = this.html.querySelector("#theme-options");
		this.languageOption = this.html.querySelector("#language-options");
		this.imagePreview = this.html.querySelector(".image-preview");
		this.newSeedBtn = this.html.querySelector(".btn-new-seed");
		this.newImageInp = this.html.querySelector("#new-image");
		this.errorAlert =  this.html.querySelector(".alert-danger");
		this.successAlert = this.html.querySelector(".alert-success");
		this.submitBtn = this.html.querySelector(".btn-submit");
		this.phoneContainer = this.html.querySelector(".phone-container");
		this.countryCode = this.html.querySelector("#country-code-select");
		this.phoneNumberInp = this.html.querySelector("#phone-number-input");
		this.qrcodeCheckbox = this.html.querySelector("#qrcode");
		this.phoneCheckbox = this.html.querySelector("#phone");
		this.showQrcode = this.html.querySelector(".show-qrcode");
		this.qrcodeImg = this.html.querySelector(".qrcode-img");
	}

	#scripts() {
		this.#submit();
		this.#getUserSettings();
		this.#newSeedBtn();
		this.#setNewImageInput();
		this.#phoneSelectEvent();
		this.#removeCountryName();
		this.#insertCountryNameToOption();
		this.#disableEmailCheckbox();
		this.#qrcodeSelectEvent();
		this.#showQrcode();
	}

	#submit() {
		this.settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();
			this.submitBtn.disabled = true;
			const username = this.usernameInp.value.trim();
			if (!isValidUsername(username)) {
				this.#setFieldInvalid("username");
				this.#setErrorMessage(this.messages.usernameInvalid);
				this.submitBtn.disabled = false;
				return ;
			}
			const phoneNum = this.phoneCheckbox.checked ? this.#getPhoneNumberFromInput() : null;
			if (phoneNum) {
				if (!this.#isValidPhoneNumber(phoneNum)) {
					this.#setFieldInvalid("phone");
					this.#setErrorMessage("Invalid Phone Number!");
					this.submitBtn.disabled = false;
					return ;
				}
			}

			const data = JSON.stringify({
				"username": username,
				"bio": this.bioInp.value.trim(),
				"game_theme": this.gameThemeOption.value.trim(),
				"language": this.languageOption.value.trim(),
				"image_seed": this.imageSeed.trim(),
				"tfa": {
					"qr_code": this.qrcodeCheckbox.checked,
					"phone": phoneNum
				}
			});

			const formData = new FormData();
			if (data)
				formData.append('json', data);
			if (this.imageFile)
				formData.append('image', this.imageFile);
			
			callAPI("POST", "/settings/", formData, (res, resData) => {
				if (res.ok && resData) {
					this.#loadData(resData.settings);
					this.#cleanErrorStyles();
					this.#setSuccessMessage(this.messages.success);
				}
				if (!res.ok && resData) {
					this.#cleanSuccessMessage();
					this.#setFieldInvalid(resData.field);
					this.#setErrorMessage(resData.message);
				}
				this.submitBtn.disabled = false;
			}, null, getCsrfToken());
		});
	}

	#getUserSettings() {
		callAPI("GET", "/settings/", null, (res, resData) => {
			if (res.ok && resData && resData.settings)
				this.#loadData(resData.settings);
		});
	}

	#loadData(data) {
		this.usernameInp.value = data.username;
		this.bioInp.value = data.bio;
		this.gameThemeOption.value = data.game_theme;
		this.languageOption.value = data.language;
		this.imagePreview.setAttribute("src", data.image);
		this.#setPhoneNumberField(data.tfa.phone);
		if (data.tfa.qr_code) {
			this.qrcodeConfigured = true;
			this.qrcodeCheckbox.checked = true;
			this.showQrcode.classList.remove("hide");
		}
		else
			this.qrcodeConfigured = false;
	}

	#newSeedBtn() {
		this.newSeedBtn.addEventListener("click", (event) => {
			event.preventDefault();
			this.imageSeed = `${this.usernameInp.value}-${Math.floor(Math.random() * 1000000)}`;
			this.imagePreview.setAttribute("src", `${IMG_PATH}${this.imageSeed}`);
			this.imageFile = "";
		});
	}

	#setNewImageInput() {
		this.newImageInp.addEventListener("change", () => {
			this.imageFile = this.newImageInp.files[0];
			if (!this.imageFile)
				return ;
			if (this.imageFile.size > MAX_IMAGE_SIZE_BYTES) {
				this.#handleImageError(this.messages.imageSize);
				return ;
			}
			if (!isFalidFormat(this.imageFile.type)) {
				this.#handleImageError(this.messages.imageType);
				return ;
			}
			if (this.savedImageUrl)
				URL.revokeObjectURL(this.savedImageUrl);
			this.savedImageUrl = URL.createObjectURL(this.imageFile);
			this.imagePreview.setAttribute("src", this.savedImageUrl);
			this.imageSeed = "";
		});
	}

	#handleImageError(msg) {
		this.#setErrorMessage(msg);
		this.imageFile = "";
		this.newImageInp.value = "";	
	}

	#setFieldInvalid(field) {
		const obj = {
			"username": () => this.usernameInp.classList.add("is-invalid"),
			"bio": () => this.bioInp.classList.add("is-invalid"),
			"game_theme": () => this.gameThemeOption.classList.add("is-invalid"),
			"language": () => this.languageOption.classList.add("is-invalid"),
			"phone": () => this.phoneNumberInp.classList.add("is-invalid"),
			"image": () => {},
		}
		if (!field || !(field in obj))
			return ;
		obj[field]();
	}

	#setErrorMessage(message) {
		if (!message)
			return ;
		this.errorAlert.classList.remove("hide");
		this.errorAlert.innerHTML = message;
		this.successAlert.classList.add("hide");
	}

	#setSuccessMessage(message) {
		if (!message)
			return ;
		this.successAlert.classList.remove("hide");
		this.successAlert.innerHTML = message;
		this.errorAlert.classList.add("hide");
	}

	#cleanSuccessMessage() {
		this.successAlert.classList.add("hide");
	}

	#cleanErrorStyles() {
		const elm = this.html.querySelector(".is-invalid");
		if (elm)
			elm.classList.remove("is-invalid");
		this.errorAlert.classList.add("hide");
	}

	#phoneSelectEvent() {
		const elm = this.html.querySelector("#phone");
		if (!elm)
			return ;
		elm.addEventListener("change", () => {
			if (elm.checked)
				this.phoneContainer.classList.remove("hide");
			else
				this.phoneContainer.classList.add("hide");
		});
	}

	#removeCountryName() {
		this.countryCode.addEventListener("click", (event) => {
			let value = event.target.options[event.target.selectedIndex].innerHTML;
			let idx = value.indexOf("&nbsp;&nbsp;") + "&nbsp;&nbsp;".length;			
			let newValue = value.substring(idx);
			this.countryBufferStr = value.substring(0, idx);
			event.target.options[event.target.selectedIndex].innerHTML = newValue;
		});
	}

	#insertCountryNameToOption() {
		this.countryCode.addEventListener("mousedown", (event) => {
			const actualValue = event.target.options[event.target.selectedIndex].innerHTML;
			if (this.countryBufferStr){
				event.target.options[event.target.selectedIndex].innerHTML = `${this.countryBufferStr}${actualValue}`;
				this.countryBufferStr = "";
			}
		});		
	}

	#setCountryCode(code) {
		const option = this.html.querySelector(`[value="${code}"]`);
		if (!option)
			return ;

		option.setAttribute("selected", "");
		let value = option.innerHTML;
		let idx = value.indexOf("&nbsp;&nbsp; ");
		if (idx < 0)
			return ;

		idx += "&nbsp;&nbsp; ".length;
		let newValue = value.substring(idx);
		this.countryBufferStr = value.substring(0, idx);
		option.innerHTML = newValue;
	}

	#disableEmailCheckbox() {
		const inp = this.html.querySelector("#email");
		if (!inp)
			return ;
		inp.disabled = true;
	}

	#getPhoneNumberFromInput() {
		let phoneNumber = `${this.countryCode.value.trim()} ${this.phoneNumberInp.value.trim()}`;
		return phoneNumber.trim();
	}

	#isValidPhoneNumber(number) {
		const regex = /^\+\d{1,3} \d{7,14}$/;
		return(regex.test(number));
	}

	#setPhoneNumberField(data) {
		if (data) {
			this.phoneContainer.classList.remove("hide");
			this.phoneCheckbox.checked = true;
			this.phoneNumberInp.value = data.substring(data.indexOf(" "));
			this.#setCountryCode(data.substring(0, data.indexOf(" ")));
		}
		else
			this.#setCountryCode("+351");
	}

	#qrcodeSelectEvent() {
		this.qrcodeCheckbox.addEventListener("change", () => {
			if (this.qrcodeConfigured) {
				if (this.qrcodeCheckbox.checked)
					this.showQrcode.classList.remove("hide");
				else
					this.showQrcode.classList.add("hide");
			}
			else
				this.showQrcode.classList.add("hide");
		});
	}

	#showQrcode() {
		this.showQrcode.addEventListener("click", (event) => {
			this.showQrcode.disabled = true;
			event.preventDefault();
			callAPI("POST", "/two-factor-auth/request-qr-code/", null, (res, data) => {
				if (res.ok && data && data.qr_code) {
					this.qrcodeImg.classList.remove("hide");
					this.qrcodeImg.setAttribute("src", 'data:image/png;base64,' + data.qr_code);
				}
				this.showQrcode.disabled = false;
			}, null, getCsrfToken());
		});
	}
}

customElements.define("app-configs", AppConfigs);