const http = require('http');
const fs = require('fs');
const rexus = require('./rexus.js');
const log = require('./log.js');

var options = {
	key: fs.readFileSync('/etc/letsencrypt/keys/0014_key-certbot.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/csr/0014_csr-certbot.pem')
};

var root = rexus.App();

http.createServer(function(req, res) {
	let requestIP = req.headers['x-forwarded-for'];
	let domain = req.headers['x-forwarded-host'];
	if (domain === undefined || requestIP === undefined) {
		log.warning("Could not get request details!");
		log.warning(req.headers);
	} else {
		log.info("Request from", requestIP, "to", domain + req.url);
	}
	let domainParts = req.url.split('/').filter(x => x.length);

	let response = root.resolve(domainParts);

	res.writeHead(response.status, response.headers);
	res.end(response.content);
}).listen(3000, (err) => {
	if (err) {
		return log.error('something bad happened', err);
	}

	log.success('Server running at http://localhost:3000/');
});

