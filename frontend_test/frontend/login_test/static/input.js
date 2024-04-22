export class InputHandler {
	constructor(down, up, left, right) {
		this.keys = [];
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
	recieve(newInput) {
		this.keys = newInput;
	}
	async sendKey(keys) {
		fetch("http://127.0.0.1:8000/user/api/game", {
			credentials: 'include',
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				player_id: 1,
				keys: keys
			})
		})
		.then(response => response.json())
		.then (data => {
			console.log(data);
		})
		.catch(error => {
			console.log(error);
		});
	}

	send() {
		if (this.keys.includes(this.key[1]) - this.keys.includes(this.key[0]) == 1)
		{
			console.log("key -> S")
			this.sendKey("s")
		}
		else if (this.keys.includes(this.key[1]) - this.keys.includes(this.key[0]) == -1)
		{
			console.log("key -> W")
			this.sendKey("w")
		}
		return (this.keys.includes(this.key[1]) - this.keys.includes(this.key[0]));
	}
}