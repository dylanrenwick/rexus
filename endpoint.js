
module.exports = class Endpoint {
	constructor() {
		this.endpoints = {};
	}

	resolve(urlparts) {
		if (urlparts.length == 1) {
			return {
				status: 200,
				headers: {'Content-Type': 'text/plain'},
				content: 'It worked'
			};
		} else {
			if (Object.keys(this.endpoints).includes(urlparts[0])) {
				return this.endpoints[urlparts[0]].resolve(urlparts.slice(1));
			} else {
				return {
					status: 404,
					headers: {'Content-Type': 'text/plain'},
					content: 'Endpoint not found'
				};
			}
		}
	}
}
