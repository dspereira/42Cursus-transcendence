import { redirect } from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="profile"></side-panel>
		<div class="content content-small">
			<h1>Page Profile</h1>
			<p>
			Rump drumstick tri-tip alcatra. Flank ground round pastrami beef short ribs pork belly jowl. Spare ribs beef ribs andouille, frankfurter short loin shankle venison salami turducken. Beef ribs alcatra capicola shoulder pork loin sirloin biltong turkey pancetta flank pork andouille bacon. Doner hamburger shoulder tenderloin flank prosciutto corned beef. Chislic tongue doner porchetta pastrami sirloin filet mignon leberkas brisket ribeye pork chop shank cupim corned beef sausage.
			</p>
			<p>
			Rump drumstick tri-tip alcatra. Flank ground round pastrami beef short ribs pork belly jowl. Spare ribs beef ribs andouille, frankfurter short loin shankle venison salami turducken. Beef ribs alcatra capicola shoulder pork loin sirloin biltong turkey pancetta flank pork andouille bacon. Doner hamburger shoulder tenderloin flank prosciutto corned beef. Chislic tongue doner porchetta pastrami sirloin filet mignon leberkas brisket ribeye pork chop shank cupim corned beef sausage.
			</p>
		</div>
	`;
	return html;
}


const title = "Profile";

export default class PageProfile extends HTMLElement {
	static #componentName = "page-profile";

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
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
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageProfile.componentName, PageProfile);