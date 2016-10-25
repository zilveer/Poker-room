var fs = require('fs');

if(typeof process.argv[3] === 'undefined')
	var tag = 'dev';
var conf = JSON.parse(fs.readFileSync('config/' + tag + '.json', 'utf8'));
var slayer = require('./Slayer-server')

slayer.init(conf);

try {
	Server.start();
} catch (e) {
	console.log("SLERROR:", e);
}