
const Simple = require('./simple')

module.exports.createSimpleton = function(player) {
	return new Simple(player)
}