export class InputHandler {
	constructor(down, up, left, right, id) {
		this.keys = [];
		this.id = id;
		window.addEventListener('keydown', e => {this.keyDown(e)});
		window.addEventListener('keyup', e => {this.keyUp(e)});
		this.key = [down, up, left, right];
	}

	keyDown(e) {
		if ((this.key.includes(e.key))
				&& this.keys.indexOf(e.key) === -1) {
					this.keys.push(e.key);
			}
	}

	keyUp(e) {
		if ((this.key.includes(e.key))) {
			this.keys.splice(this.keys.indexOf(e.key), 1);
		}
	}
}