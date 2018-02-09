// const http = require('http');
// const normalizePort = require('normalize-port')

// //const port = process.env.PORT || 3000
// var port = normalizePort(process.env.PORT || process.env.VCAP_APP_PORT || '3000');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Second Test');
// }).listen(port, '0.0.0.0');
// console.log('Serverning at http://0.0.0.0:' + port.toString() + '/');



// ****************************

var express = require('express');
var app = express();

var mc = require('mongodb').MongoClient;
var assert = require('assert');

function getURI() {
    if(process.env.VCAP_SERVICES){   
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var fullurl = (env['mlab'][0]['credentials']['uri']);
	var front = fullurl.split('?')[0];
	return front
    } else {
	return "mongodb://localhost:27017/db"
    }
}

var port = (process.env.PORT || 3001);
 

app.get('/env', function (req, res) {
    res.write('this is the environment\n');
    for (var key in process.env) {
     	res.write(key + " : " + process.env[key] + "\n" );
    }
    res.end();
});

app.get('/', function (req, res) {
    console.log("someone touched me\n");
    var mongourl = getURI();
    res.send(mongourl);
});

app.get('/con', function (req, res) {
    var url = getURI();
    mc.connect(url, function(err,db) {
	assert.equal(null,err);
	res.send("connected to servers111");
	console.log("connected to server");
	db.close()
    })
});

app.get('/set', function (req, res) {
    res.send(JSON.stringify(req.query))
    // jam this straight into mongo
    var url = getURI();
    mc.connect(url, function(err,client) {
    var db = client.db('CloudFoundry_h28rseju_cmi4q0oj');
	assert.equal(null,err);
	db.collection('node').insertOne(req.query, function (err, result) {
	    assert.equal(err, null);
	    //db.close();
	});
    });
});

app.get('/get', function (req, res) {
    var url = getURI();
    mc.connect(url, function(err,client) {
    var db = client.db('CloudFoundry_h28rseju_cmi4q0oj');
	assert.equal(null,err);
	var cursor = db.collection('node').find();
	cursor.each(function(err,doc) {
	    assert.equal(null,err);
	    if (doc != null) {
		res.write(JSON.stringify(doc) + "\n");
	    } else {
		//db.close();
		res.end();
	    }   	
	});
    });
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
 
  console.log('Example app listening at http://%s:%s', host, port);
});
