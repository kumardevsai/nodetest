const http = require('http');
const normalizePort = require('normalize-port')

//const port = process.env.PORT || 3000
var port = normalizePort(process.env.PORT || process.env.VCAP_APP_PORT || '3000');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hellow World2222222');
}).listen(port, '0.0.0.0');
console.log('Serverning at http://0.0.0.0:' + port.toString() + '/');
