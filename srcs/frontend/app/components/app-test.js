const styles = `
    h1 {
        color: blue;
    }
`;

const getHtml = function(data) {
    const html = `
        <h1>${data['message']}</h1>
    `;

    return html;
}

export default class AppTest extends HTMLElement {

    static #compName = "app-test";

    #data = {};

	static observedAttributes = ["message"];

	constructor() {
		super()

		console.log(`start component: ${AppTest.#compName}`);
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		const elmBody = document.createElement("div");
		elmBody.classList.add(`${this.elmtId}`);
		const styles = document.createElement("style");
        
        
        this.#data['message'] = this.getAttribute('message');

		styles.textContent = this.#styles();
		elmBody.innerHTML = this.#html(this.#data);
		this.appendChild(styles);
		this.appendChild(elmBody);

	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(`Old Value: ${oldValue}. New Value: ${newValue}.`);
		this.querySelector("h1").textContent = newValue;
	}

	#styles() {
		return `@scope (.${this.elmtId}) {${styles}}`;
	}

	#html(data){
		return getHtml(data);
	}

	static get compName() {
		return this.#compName;
	}
}

customElements.define(AppTest.compName, AppTest);
