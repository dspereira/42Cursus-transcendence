import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("Home");
	}

	async getHtml()
	{
		return `
			<h1>Welcome to the DashBoard!</h1>
			<p>
				This is the dashboard!
			</p>
			<p>
				<b><a href="/posts" data-link>View recent posts.</a></b>
			</p>
			<h2>
				Or play the game:
			</h2>
			<p>
				<b><a href="/game" data-link>Game!</a></b>
			</p>
		`;
	}
}