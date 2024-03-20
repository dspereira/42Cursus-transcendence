import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("Settings");
	}

	async getHtml() 
	{
		return `
			<h1>Settings</h1>
			<p>
				Configure your settings here!
			</p>
			<p>
			<b><a href="/" data-link>Home.</a></b>
			</p>
		`;
	}
}