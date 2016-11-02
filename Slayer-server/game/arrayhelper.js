
global.len = function(obj) {
    if(typeof obj === 'object') return Object.keys(obj).length;
    else return obj.length;
};

module.exports = {
	/**
	 * Generate inverted frequency array from array of objects
	 */
	frequencies: function(cont, attr) {
		var type_ifreqs = cont.reduce((type, item) => {
			type[item[attr]] = !type[item[attr]] ? 1 : type[item[attr]]+1;

			return type;
		}, {});

		var type_freqs = {};
		for(var type in type_ifreqs) {
			var freq = type_ifreqs[type];

			if(!type_freqs[freq]) type_freqs[freq] = [];
			type_freqs[freq].push( type );
		}

		// there is no such thing as a 1 element series
		delete type_freqs[1];

		return type_freqs;
	},

	filter: function(cont, attr, value) {
		var arr = [];
		for(var c in cont) {
			if(cont[c][attr] == value){
				arr.push(cont[c])
			}
		}
		return arr;
	},

	max: function(cont, attr) {
		return cont.reduce((max, item) => {
			return item[attr] > max ? item[attr] : max;
		}, 0);
	},

	/**
	 * Get longest series in list of ranks
	 * @todo: this is partly poker logic
	 */
	max_series: function(cont) {
		var arr = Array.from(cont.reduce((rank, item) => {
			rank.add(parseInt(item.rank))
			return rank;
		}, new Set()));

		arr.sort((a, b) => { return a - b; });

		// Special case for suckers' straight, where Ace acts as a low
		var suckers = [2,3,4,5,14];
		if(arr.length == suckers.length && arr.every((v,i)=> v === suckers[i])) {
			return [5, 5];
		}

		// Fetch biggest sequence (dinprog)
		var res = [0];
		for(var i=1;i<arr.length;i++) {
			res[i] = (arr[i] == arr[i-1] + 1) ? res[i-1] + 1 : 0;
		}

		var series_length = Math.max.apply({},res);
		return [series_length+1, arr[res.indexOf(series_length)]];
	},

	shuffle: function(arr) {
		var collection = arr.slice(); 
		var len = arr.length, random, temp;

		while (len) {
			random = Math.floor(Math.random() * len);
			len -= 1;
			temp = collection[len];
			collection[len] = collection[random];
			collection[random] = temp;
		}

		return collection;
	}
};