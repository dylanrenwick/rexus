const Controller = require('../controller.js');

var _instance;

module.exports = {
	create: () => {
		if (_instance == null || _instance == undefined) _instance = new Index();
		return _instance;
	}
}

class Index extends Controller {
	constructor() {
		super();
	}

	index() {
		return this.render('index', {content: 'Hello!!'});
	}
}
