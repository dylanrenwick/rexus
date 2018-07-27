const View = require('./view.js');
const rexus = require('./rexus.js');

const App = rexus.App();

module.exports = class Controller {
	constructor() {
		this.view = new View();
	}

	render(fileName, params = {}) {
		if (params['controller'] === undefined) params['controller'] = this.constructor.name.toLowerCase();

		let filePath = App.viewPath + this.constructor.name.toLowerCase() + '/' + fileName + '.rx';
		return {
			status: 200,
			content: this.view.render(filePath, params),
			headers: {}
		};
	}
}
