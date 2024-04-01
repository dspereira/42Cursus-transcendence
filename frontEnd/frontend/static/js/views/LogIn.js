import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("Login");
	}

	async getHtml() 
	{
		return `
			<h1>This is log in page!</h1>

			<h1 class="fw-bold">Under construction!</h1>
			<p><b><a href="/" data-link>Home.</a></b></p>
			`;
	}
}