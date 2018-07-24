const Endpoint = require('./endpoint.js');

module.exports = {
	root: createRootEndpoint()
};

function createRootEndpoint() {
	let endpoint = new Endpoint();
	endpoint.endpoints = {
		home: new Endpoint(),
		user: new Endpoint(),
		chat: new Endpoint(),
		login: new Endpoint()
	};
	return endpoint;
}
