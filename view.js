const fs = require('fs');
const rexus = require('./rexus.js');
const log = require('./log.js');

const App = rexus.App();

module.exports = class View {
	constructor() {
		this.params = {rootPath: App.rootPath};
	}

	render(viewPath, params = {}) {
		log.info("Rendering", viewPath);
		for(let key in params) {
			this.params[key] = params[key];
		}

		let content = '';

		content += this.renderFile('view/_template/header.rx');
		content += this.renderFile(viewPath);
		content += this.renderFile('view/_template/footer.rx');

		for(let key in params) {
			delete this.params[key];
		}

		return content;
	}

	renderFile(viewPath) {
		let fileContents = fs.readFileSync(viewPath, 'utf8');

		let openIndices = [];
		let closeIndices = [];
		let i = 0;
		while((i = fileContents.indexOf('{%', i + 1)) >= 0) openIndices.push(i + 1);
		i = 0;
		while((i = fileContents.indexOf('}', i + 1)) >= 0) closeIndices.push(i);

		if (openIndices.length !== 0 && closeIndices.length !== 0) {
			let pairs = [];
			let allIndices = openIndices.concat(closeIndices).sort((a, b) => a - b);
			let count = allIndices.length;
			let indentCount = 0;
			let start = 0;
			let end = 0;
			for(let i = 0; i < count; i++) {
				let char = fileContents[allIndices[i]];
				if (fileContents[allIndices[i]-1] !== '\\' || fileContents[allIndices[i]-2] === '\\') {
					if (char === '%') {
						if (indentCount === 0) start = allIndices[i];
						indentCount++;
					} else if (char === '}' && indentCount > 0) {
						indentCount--;
						if (indentCount === 0) {
							end = allIndices[i];
							pairs.push({start: start, end: end});
						}
					}
				}
			}

			let replacements = [];
			for(let i = 0,j = pairs.length; i < j; i++) {
				let code = fileContents.substring(pairs[i].start + 1, pairs[i].end);
				let src = '() => {' + code + '}';
				let f = eval(src);
				let original = '{%' + code + '}';
				let content = f();
				replacements.push({from: original, to: content});
			}

			for(let i = 0,j = replacements.length; i < j; i++) {
				fileContents = fileContents.replace(replacements[i].from, replacements[i].to);
			}
		}

		return fileContents;
	}
}
