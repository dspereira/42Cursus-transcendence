import {callAPI} from "../utils/callApiUtils.js";
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
	/*background-color: red;*/
}

.image-settings-container {
	dispay: flex;
	flex-direction: column; 	
	justify-content: center;
	width: 30%;

	/*background-color: blue;*/
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

#new-username, #new-bio, #theme-options, #language-options {
	background-image: none;
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
					<legend>Choose where to receive your two-factor authentication:</legend>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="qrcode" id="qrcode">
						<label class="form-check-label" for="qrcode">QR Code</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="email" id="email">
						<label class="form-check-label" for="email">Email</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="phone" id="phone">
						<label class="form-check-label" for="phone">${data.langDict.security_phone_label}</label>
					</div>
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
					<!--<input id="new-image" class="hide" type="file" accept="image/png, image/jpeg, image/webp">-->
					<input id="new-image" class="hide" type="file">
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
		this.imageSeed = "";
		this.imageFile = "";
	}

	connectedCallback() {
		this.messages = {
			"success": this.data.langDict.success,
			"usernameInvalid": this.data.langDict.username_invalid,
			"imageSize": `${this.data.langDict.image_size} ${MAX_IMAGE_SIZE_BYTES / MEGABYTE}MB`,
			"imageType": `${this.data.langDict.image_type}${suportedFileTypesToString()}`
		}
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "language") {
			this.data.langDict = getLanguageDict(newValue, enAppConfigs, ptAppConfigs, esAppConfigs);
			this.data.language = newValue;
		}
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
		this.#submit();
		this.#getUserSettings();
		this.#newSeedBtn();
		this.#setNewImageInput();
	}

	#submit() {
		this.settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const username = this.usernameInp.value.trim();
			if (!this.#isValidUsername(username)) {
				this.#setFieldInvalid("username");
				this.#setErrorMessage(this.messages.usernameInvalid);
				return ;
			}

			const data = JSON.stringify({
				"username": username,
				"bio": this.bioInp.value.trim(),
				"game_theme": this.gameThemeOption.value.trim(),
				"language": this.languageOption.value.trim(),
				"image_seed": this.imageSeed.trim()
			});

			const formData = new FormData();
			if (data)
				formData.append('json', data);
			if (this.imageFile)
				formData.append('image', this.imageFile);

			callAPI("POST", "http://127.0.0.1:8000/api/settings/", formData, (res, resData) => {
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
			});
		});
	}

	#getUserSettings() {
		callAPI("GET", "http://127.0.0.1:8000/api/settings/", null, (res, resData) => {
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
	}

	#isValidUsername(username) {
		let regex = /^[a-zA-Z0-9_-]+$/;
		return regex.test(username);
	}

	#newSeedBtn() {
		this.newSeedBtn.addEventListener("click", () => {
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
				this.#setErrorMessage(this.messages.imageSize);
				return ;
			}
			if (!isFalidFormat(this.imageFile.type)) {
				this.#setErrorMessage(this.messages.imageType);
				return ;
			}
			this.imagePreview.setAttribute("src", URL.createObjectURL(this.imageFile));
			this.imageSeed = "";
		});
	}

	#setFieldInvalid(field) {
		if (!field)
			return ;
		const obj = {
			"username": () => this.usernameInp.classList.add("is-invalid"),
			"bio": () => this.bioInp.classList.add("is-invalid"),
			"game_theme": () => this.gameThemeOption.classList.add("is-invalid"),
			"language": () => this.languageOption.classList.add("is-invalid"),
			"image": () => {}
		}
		obj[field]();
	}

	#setErrorMessage(message) {
		if (!message)
			return ;
		this.errorAlert.classList.remove("hide");
		this.errorAlert.innerHTML = message;
	}

	#setSuccessMessage(message) {
		if (!message)
			return ;
		this.successAlert.classList.remove("hide");
		this.successAlert.innerHTML = message;
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
}

customElements.define("app-configs", AppConfigs);