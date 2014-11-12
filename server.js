var restify = require('restify'),
	fs = require('fs'),
	server = restify.createServer({
		name: 'BackPocketToolset',
		version: '1.0.0'
	});

server
	.use(restify.fullResponse())
	.use(restify.bodyParser());


server.get('/', function indexHTML(req, res, next) {
	fs.readFile(__dirname + '/test.html', function(err, data) {
		if (err) {
			next(err);
			return;
		}

		res.setHeader('Content-Type', 'text/html');
		res.writeHead(200);
		res.end(data);
		next();
	});
});

server.get(/.*/, restify.serveStatic({
	directory: './assets/'
}));

server.listen(5543);

console.log('%s listening at %s', server.name, server.url);