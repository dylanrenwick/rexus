const http = require('http');
const fs = require('fs');
const rexus = require('./rexus.js');
const log = require('./log.js');

var options = {
	key: fs.readFileSync('/etc/letsencrypt/keys/0014_key-certbot.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/csr/0014_csr-certbot.pem')
};

var root = rexus.root;

http.createServer(function(req, res) {
	let requestIP = req.rawHeaders[req.rawHeaders.indexOf('X-Forwarded-For') + 1];
	let domain = req.rawHeaders[req.rawHeaders.indexOf('X-Forwarded-Host') + 1];
	log.log("Request from", requestIP, "to", domain + req.url, log.LEVEL_INFO);
	let domainParts = req.url.split('/').filter(x => x.length);
	
	let response = root.resolve(domainParts);

	res.writeHead(response.status, response.headers);
	res.end(response.content);
}).listen(3000, (err) => {
	if (err) {
		return log.log('something bad happened', err, log.LEVEL_ERROR);
	}

	log.log('Server running at http://localhost:3000/', log.LEVEL_NOTICE);
});
