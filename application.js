const fs = require('fs');

module.exports = class App {
	constructor() {
		this.controllerPath = './controller/';
		this.modelPath = './model/';
		this.viewPath = './view/';
		this.rootPath = '/rexus/';
	}

	resolve(request) {
		let names = this.getPartNames(request);

		if (!this.controllerExists(names.controller)) return this.error404(request);

		let controllerFile = require(this.controllerPath + names.controller + '.js');
		if (!controllerFile.create) return this.error500(request);
		let controller = controllerFile.create();

		if (!controller[names.action]) return this.error404(request);

		return controller[names.action](request);
	}

	getPartNames(request) {
		if (request.length === 0) {
			return { controller: 'index', action: 'index' };
		}

		if (request.length === 1) {
			let controller = '';
			let action = '';
			if (this.controllerExists(request[0])) {
				controller = request[0];
				action = 'index';
			} else {
				controller = 'index';
				action = request[0];
			}

			return { controller: controller, action: action };
		}

		return { controller: request[0], action: request[1] };
	}

	controllerExists(name) {
		return fs.existsSync(this.controllerPath + name + '.js');
	}

	error404(request) {
		return {
			status: 404
		};
	}

	error500(request) {
		return {
			status: 500
		};
	}
}
