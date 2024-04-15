import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("404");
	}

	async getHtml() 
	{
		return `
			<h1>Error:404!</h1>

			<h2>Page not found </h2>
			
			
			<p>
 			<!--<pre>
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 			</pre> -->
			</p>
			`;
	}
}